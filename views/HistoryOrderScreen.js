import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, SafeAreaView, TextInput, TouchableOpacity, 
    StyleSheet, ScrollView, Image, FlatList, Dimensions
} from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { Host } from '../controllers/Host';
import DatePicker from 'react-native-date-picker';
import RBSheet from 'react-native-raw-bottom-sheet';

export function HistoryOrderScreen() {
    const header = ['Tên', 'Số lượng', 'Thành tiền'];
    const [data, setData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [date, setDate] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(new Date());
    const refRBSheet = useRef();
    const refRBSheetEnd = useRef();
    useEffect(() => {
        fetch(Host + '/bill', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
            if (json.status == 'fail') {
                showAlert('Error', 'Lỗi kết nối!');
            }
            else {
                for (var i of json.data) {
                    var countCost = 0;
                    var temp = [];
                    for (var j of i.detail_bills) {
                        temp.push([j.name, j.counting + '', showAsMoney((parseInt(j.cost) * parseInt(j.counting)) + '') + ' đ']);
                        countCost += parseInt(j.cost) * parseInt(j.counting);
                    }
                    i.detail_bills = temp;
                }
                setData(json.data);
                setDataFilter(filterData(json.data, new Date(), new Date()));
            }
        })
        .catch((error) => console.log(error));
    }, []);
    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} height = {250} dragFromTopOnly = {true} customStyles = {{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }
                }} onClose = {() => {
                    setDataFilter(filterData(data, date, dateEnd));
                }}>
                    <View style = {{alignSelf: 'center'}}>
                        <DatePicker mode='date' date = {date} onDateChange = {setDate}/>
                    </View>
                </RBSheet>
                <RBSheet ref={refRBSheetEnd} closeOnDragDown={true} closeOnPressMask={true} height = {250} dragFromTopOnly = {true} customStyles = {{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    },
                }} onClose = {() => {
                    setDataFilter(filterData(data, date, dateEnd));
                }}>
                    <View style = {{alignSelf: 'center'}}>
                        <DatePicker mode='date' date = {dateEnd} onDateChange = {setDateEnd}/>
                    </View>
                </RBSheet>
                <View style = {styles.filterDate}>
                    <View style = {styles.datepicker}>
                        <TouchableOpacity onPress = {() => refRBSheet.current.open()}>
                            <Image source = {require('../resources/calendar.png')} style = {{width: 24, height: 24, marginRight: 10}} resizeMode = 'stretch'/>
                        </TouchableOpacity>
                        <Text style = {{fontSize: 16, fontWeight: '600'}}>{date.toLocaleDateString()}</Text>
                    </View>
                    <Image source = {require('../resources/to.png')} style = {{width: 24, height: 24, marginLeft: 10, marginRight: 10}} resizeMode='stretch'/>
                    <View style = {styles.datepicker}>
                        <TouchableOpacity onPress = {() => refRBSheetEnd.current.open()}>
                            <Image source = {require('../resources/calendar.png')} style = {{width: 24, height: 24, marginRight: 10}} resizeMode = 'stretch'/>
                        </TouchableOpacity>
                        <Text style = {{fontSize: 16, fontWeight: '600'}}>{dateEnd.toLocaleDateString()}</Text>
                    </View>
                </View>
                <FlatList data = {dataFilter} ItemSeparatorComponent = {() => (<View style = {styles.separator}/>)} renderItem = {({item}) => (
                    <View style = {{margin: 10}}>
                        <View>
                            <Text style = {styles.text}>Ngày order: {item.dateOrder}</Text>
                            <Text style = {styles.text}>Địa chỉ nhận hàng: {item.addressShipping}</Text>
                            <Text style = {styles.text}>Lời nhắn: {item.message}</Text>
                        </View>
                        <View style = {{marginTop: 10}}>
                            <Table borderStyle = {{borderWidth: 1}}>
                                <Row data = {header} style = {styles.head} textStyle = {styles.textTable} flexArr={[4, 2, 3]}/>
                                <Rows data = {item.detail_bills} textStyle = {styles.textTable} flexArr={[4, 2, 3]}/>
                            </Table>
                        </View>
                        <View style = {{marginTop: 5}}>
                            <Text style = {styles.text}>Tổng tiền: {showAsMoney(countTotalCost(item.detail_bills) + '')} đồng</Text>
                            <Text style = {styles.text}>Giảm giá: {showAsMoney(item.discount + '')} đồng</Text>
                            <Text style = {styles.text}>Số tiền phải thanh toán: {showAsMoney((countTotalCost(item.detail_bills) - item.discount) + '')} đồng</Text>
                        </View>
                    </View>
                )}
                keyExtractor = {item => item.id + ''}/>
            </SafeAreaView>
        </View>
    );
}

const countTotalCost = (detail_bills) => {
    var count = 0;
    for (var i of detail_bills) {
        count += parseInt(convertMoneyToNumber(i[2]));
    }
    return count;
};

const convertMoneyToNumber = (money) => {
    var s = "";
    for (var i = 0; i < money.length; i++) {
        if (money[i] != ',') {
            s += money[i];
        }
    }
    return parseInt(s);
};

const filterData = (dt, dtFrom, dtEnd) => {
    var temp = [];
    for (var i = 0; i < dt.length; i++) {
        var dateTemp = (dt[i].dateOrder + '').toDate('yyyy-MM-dd HH:mm:ss');
        if (dateTemp >= dtFrom && dateTemp <= dtEnd) {
            temp.push(dt[i]);
        }
    }
    return temp;
}

const showAsMoney = (money) => {
    var index = 0;
    var result = '';
    while (index < money.length)
    {
      var i = money.length - 1 - index;
      result += money[i];
      index += 1;
      if (index < money.length && index % 3 == 0) {
        result += ',';
      }
    }
    return result.split('').reverse().join('');
};

String.prototype.toDate = function(format)
{
  var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
  var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
  var formatItems     = normalizedFormat.split('-');
  var dateItems       = normalized.split('-');

  var monthIndex  = formatItems.indexOf("mm");
  var dayIndex    = formatItems.indexOf("dd");
  var yearIndex   = formatItems.indexOf("yyyy");
  var hourIndex     = formatItems.indexOf("hh");
  var minutesIndex  = formatItems.indexOf("ii");
  var secondsIndex  = formatItems.indexOf("ss");

  var today = new Date();

  var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
  var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
  var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

  var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
  var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
  var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

  return new Date(year,month,day,hour,minute,second);
};

const styles = StyleSheet.create({
    head: {
        height: 40,
        backgroundColor: '#42b88370'
    },
    textTable: {
        margin: 6,
        textAlign: 'center',
        fontSize: 14
    },
    text: {
        fontSize: 14,
        marginTop: 5
    },
    button: {
        height: 49,
        backgroundColor: '#c9753d',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 8
    },
    separator: {
        height: 1,
        width: Dimensions.get('screen').width - 20,
        backgroundColor: '#000000',
        alignSelf: 'center'
    },
    chooseDate: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10
    },
    datepicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    filterDate: {
        flexDirection: 'row', justifyContent: 'center', 
        borderWidth: 1, margin: 10, alignItems: 'center'
    }
});