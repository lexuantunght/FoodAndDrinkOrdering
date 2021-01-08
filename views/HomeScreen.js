import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, TextInput, StyleSheet, Image, 
    TouchableOpacity, Dimensions, Modal, ScrollView, Alert, StatusBar
} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import CheckBox from '@react-native-community/checkbox';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-tiny-toast';
import { Host, HostName } from '../controllers/Host';
import { useIsFocused } from '@react-navigation/native';
import { getAll } from '../controllers/ItemController';
import { useRef } from 'react';

export function HomeScreen({navigation}) {
    const isFocus = useIsFocused();
    const refRBSheet = useRef();
    const [dataItem, setDataItem] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [checkDrinking, setCheckDrinking] = useState(true);
    const [checkFood, setCheckFood] = useState(true);
    const [checkSizeM, setCheckSizeM] = useState(true);
    const [checkSizeL, setCheckSizeL] = useState(true);
    const [checkCost1, setCheckCost1] = useState(true);
    const [checkCost2, setCheckCost2] = useState(true);
    const [checkCost3, setCheckCost3] = useState(true);
    const [category, setCategory] = useState([1, 2]);
    const [size, setSize] = useState([1, 2]);
    const [cost, setCost] = useState([1, 2, 3]);
    const [curPage, setCurPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <TouchableOpacity style = {{marginLeft: 10}} onPress = {() => refRBSheet.current.open()}>
                    <Image source = {require('../resources/menu.png')} style = {{width: 27, height: 25}} resizeMode = 'stretch'/>
                </TouchableOpacity>
            ),
        });
        getAll((data) => {
            setDataItem(data);
            setDataFilter(data);
            setTotalPage(parseInt((data.length - 1) / 20) + 1);
        });
    }, []);
    return(
        <View style = {{flex: 1}}>
            <StatusBar barStyle = 'dark-content'/>
            <SafeAreaView style = {{flex: 1, backgroundColor: '#ffffff'}}>
                <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} height = {320} dragFromTopOnly = {true} customStyles = {{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }
                }} onClose = {() => {
                    var filter = filterByMenu(category, size, cost, dataItem);
                    setDataFilter(filter);
                    setTotalPage(parseInt((filter.length - 1) / 20) + 1);
                    setCurPage(1);
                }}>
                    <ScrollView scrollEnabled = {true}>
                        <View style = {{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                                <Image source = {require('../resources/category.png')} style = {{width: 20, height: 20, margin: 5}} resizeMode = 'stretch'/>
                                <Text style = {{fontSize: 14, margin: 5}}>Phân loại</Text>
                        </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Đồ uống</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkDrinking} onValueChange = {(v) => {
                                        setCheckDrinking(v);
                                        if (v) {
                                            var temp = category;
                                            temp.push(1);
                                            setCategory(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of category) {
                                                if (i != 1) {
                                                    temp.push(i);
                                                }
                                            }
                                            setCategory(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Đồ ăn</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkFood} onValueChange = {(v) => {
                                        setCheckFood(v);
                                        if (v) {
                                            var temp = category;
                                            temp.push(2);
                                            setCategory(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of category) {
                                                if (i != 2) {
                                                    temp.push(i);
                                                }
                                            }
                                            setCategory(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                        <View style = {{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                            <Image source = {require('../resources/ruler.png')} style = {{width: 20, height: 20, margin: 5}} resizeMode = 'stretch'/>
                            <Text style = {{fontSize: 14, margin: 5}}>Kích cỡ</Text>
                        </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Size M (700 ml)</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkSizeM} onValueChange = {(v) => {
                                        setCheckSizeM(v);
                                        if (v) {
                                            var temp = size;
                                            temp.push(1);
                                            setSize(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of size) {
                                                if (i != 1) {
                                                    temp.push(i);
                                                }
                                            }
                                            setSize(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Size L (1000 ml)</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkSizeL} onValueChange = {(v) => {
                                        setCheckSizeL(v);
                                        if (v) {
                                            var temp = size;
                                            temp.push(2);
                                            setSize(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of size) {
                                                if (i != 2) {
                                                    temp.push(i);
                                                }
                                            }
                                            setSize(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                        <View style = {{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                            <Image source = {require('../resources/money.png')} style = {{width: 20, height: 20, margin: 5}} resizeMode = 'stretch'/>
                            <Text style = {{fontSize: 14, margin: 5}}>Giá bán</Text>
                        </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Từ 10,000 - 20,000 đ</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkCost1} onValueChange = {(v) => {
                                        setCheckCost1(v);
                                        if (v) {
                                            var temp = cost;
                                            temp.push(1);
                                            setCost(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of cost) {
                                                if (i != 1) {
                                                    temp.push(i);
                                                }
                                            }
                                            setCost(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Từ 20,000 - 50,000 đ</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkCost2} onValueChange = {(v) => {
                                        setCheckCost2(v);
                                        if (v) {
                                            var temp = cost;
                                            temp.push(2);
                                            setCost(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of cost) {
                                                if (i != 2) {
                                                    temp.push(i);
                                                }
                                            }
                                            setCost(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                            <View style = {{flexDirection: 'row', alignItems: 'center', marginLeft: 40, padding: 5, marginBottom: 10}}>
                                <Text style = {{flex: 2, fontSize: 16, fontWeight: '600'}}>+ Trên 50,000 đ</Text>
                                <View style = {{flex: 1}}>
                                    <CheckBox disabled = {false} tintColor = '#42b883' onCheckColor = '#42b883' onTintColor = '#42b883' value = {checkCost3} onValueChange = {(v) => {
                                        setCheckCost3(v);
                                        if (v) {
                                            var temp = cost;
                                            temp.push(3);
                                            setCost(temp);
                                        } else {
                                            var temp = [];
                                            for (var i of cost) {
                                                if (i != 3) {
                                                    temp.push(i);
                                                }
                                            }
                                            setCost(temp);
                                        }
                                    }}/>
                                </View>
                            </View>
                    </ScrollView>
                </RBSheet>
                <View style = {styles.searchBar}>
                    <Image source = { require('../resources/search.png') } style = {{width: 18, height: 18, alignItems: 'center', margin: 10, tintColor: '#aaaaaa'}}/>
                    <TextInput placeholder = 'Tìm kiếm' style = {{flex: 1, fontSize: 17, color: '#000000'}} placeholderTextColor = '#aaaaaa' onChangeText = {text => {
                        setDataFilter(filterBySearch(text, dataItem));
                    }}/>
                </View>
                <FlatGrid style = {{flex: 1}} data = {dataFilter.slice((curPage - 1) * 20, dataFilter.length - (curPage - 1) * 20 > 20 ? ((curPage - 1) * 20 + 20) : dataFilter.length)} itemDimension = {Dimensions.get('window').width / 2 - 30} spacing = {10} 
                renderItem = {({item}) => (
                    <View style = {{backgroundColor: '#e0ece495', borderRadius: 5}}>
                        <TouchableOpacity onPress = {() => navigation.navigate('Detail', {itemSelected: item})}>
                            <Item photo = {item.avatar} name = {item.name} cost = {item.cost} desciption = {item.desciption} size = {item.nameSize}/>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.buttonOrder} onPress = {() => {
                            fetch(Host + '/items/' + item.id + '/chosen_item', {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    count: 1,
                                })
                            })
                            .then(response => response.json())
                            .then(json => {
                                if (json.status == 'fail') {
                                    showAlert('Error', 'Vui lòng thử lại sau!');
                                } else {
                                    //showAlert('Thông báo', item.name + ' đã được thêm vào danh sách order!');
                                    Toast.showSuccess(item.name + '\nđã được thêm vào danh sách order!');
                                }
                            })
                            .catch((error) => showAlert('Error', error.toString()));
                        }}>
                            <Image source = {require('../resources/order.png')} style = {{width: 18, height: 18, marginRight: 10}} resizeMode = 'stretch'/>
                            <Text style = {{fontSize: 13, fontWeight: 'bold'}}>Order ngay</Text>
                        </TouchableOpacity>
                    </View>
                )} 
                keyExtractor = {item => item.id} ListFooterComponent = {() => (dataFilter.length > 20) ? (
                    <View style = {{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 40}}>
                        <TouchableOpacity style = {{flexDirection: 'row'}} onPress = {() => {
                            if (curPage > 1) {
                                setCurPage(curPage - 1);
                            }
                        }}>
                            <Image source = {require('../resources/prev.png')} style = {{width: 18, height: 18, resizeMode: 'stretch'}} resizeMode = 'stretch'/>
                        </TouchableOpacity>
                        <View style = {{padding: 5, borderRadius: 5, backgroundColor: '#42b88370', marginRight: 10, marginLeft: 10}}>
                            <Text style = {{fontSize: 16, fontWeight: '700'}}>Trang {curPage} / {totalPage}</Text>
                        </View>
                        <TouchableOpacity style = {{flexDirection: 'row'}} onPress = {() => {
                            if (curPage < totalPage) {
                                setCurPage(curPage + 1);
                            }
                        }}>
                            <Image source = {require('../resources/next.png')} style = {{width: 18, height: 18, resizeMode: 'stretch'}} resizeMode = 'stretch'/>
                        </TouchableOpacity>
                    </View>
                ) : null}/>
            </SafeAreaView>
        </View>
    );
}


const Item = ({photo, name, cost, desciption, size}) => {
    var sizeString = '';
    if (size != 'No') {
        sizeString = ' (' + size + ')';
    }
    return(
        <View style = {styles.item}>
            <Image style = {styles.imageCover} source = {{uri: HostName + '/reservation/images/' + photo}} resizeMode = 'stretch'/>
            <Text style = {styles.nameItem}>{name + sizeString}</Text>
            <Text style = {styles.nameItem}>{showAsMoney(cost + '')} đ</Text>
        </View>
    );
};

function filterByMenu(category, size, cost, data) {
    var temp = [];
    for (var i of data) {
        var c = 0;
        if (i.cost >= 10000 && i.cost < 20000) c = 1;
        else if (i.cost >= 20000 && i.cost < 50000) c = 2;
        else c = 3;
        if (category.includes(parseInt(i['idCategory'])) && (size.includes(parseInt(i['idSize'])) || i['idSize'] == '3') && cost.includes(c)) {
            temp.push(i);
        } 
    }
    return temp;
}

function filterBySearch(keyword, data) {
    var temp = [];
    for (var i of data) {
        if ((i.name).includes(keyword)) {
            temp.push(i);
        }
    }
    return temp;
}

function showAlert(title, message) {
    Alert.alert(
        title,
        message,
        [
          { text: 'OK', onPress: () => null }
        ],
        { cancelable: false }
      );
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
}

const styles = StyleSheet.create({
    item: {
        height: Dimensions.get('window').width / 2 + 15,
    },
    imageCover: {
        height: Dimensions.get('window').width / 2 - 40,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5
    },
    nameItem: {
        flex: 1,
        fontSize: 13,
        margin: 5,
    },
    searchBar: {
        height: 38,
        alignSelf: 'center',
        margin: 10,
        borderRadius: 19,
        backgroundColor: '#e0ece495',
        color: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewModal: {
        backgroundColor: '#ffffff',
        shadowOffset: {width: 0, height: -1},
        shadowOpacity: 0.7,
        shadowRadius: 3,
        shadowColor: '#000000',
        height: '50%',
        marginTop: 'auto',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    buttonOrder: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: 35,
        borderColor: '#42b883',
        backgroundColor: '#ffffff',
        borderWidth: 2,
        margin: 5,
        borderRadius: 5
    }
});