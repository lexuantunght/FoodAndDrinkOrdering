import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Table, Row, Rows} from 'react-native-table-component';

export function BillScreen({route, navigation}) {
    const {items} = route.params;
    const {addressShipping} = route.params;
    const {dateOrder} = route.params;
    const {message} = route.params;
    const {totalCost} = route.params;
    const {discount} = route.params;
    const header = ['Tên', 'Số lượng', 'Thành tiền'];
    const [dataOrdered, setDataOrdered] = useState([]);
    useEffect(() => {
        var temp = [];
        for (var i of items) {
            temp.push([i.name, i.count, showAsMoney((parseInt(i.cost) * parseInt(i.count)) + '') + ' đ']);
        }
        setDataOrdered(temp);
    }, []);
    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <View style = {{marginLeft: 10, marginRight: 10, marginTop: 10}}>
                    <Image source = {require('../resources/bill.png')} style = {{width: 90, height: 90, alignSelf: 'center'}} resizeMode = 'stretch'/>
                    <Text style = {{fontWeight: '600', textAlign: 'center', margin: 10, fontSize: 15}}>Cảm ơn Quý khách đã order!</Text>
                    <Text style = {styles.text}>Ngày order: {dateOrder}</Text>
                    <Text style = {styles.text}>Địa chỉ nhận hàng: {addressShipping}</Text>
                    <Text style = {styles.text}>Lời nhắn: {message}</Text>
                </View>
                <ScrollView style = {{margin: 10}}>
                    <Table borderStyle = {{borderWidth: 1}}>
                        <Row data = {header} style = {styles.head} textStyle = {styles.textTable} flexArr={[4, 2, 3]}/>
                        <Rows data = {dataOrdered} textStyle = {styles.textTable} flexArr={[4, 2, 3]}/>
                    </Table>
                </ScrollView>
                <View style = {{marginLeft: 10, marginRight: 10}}>
                    <Text style = {styles.text}>Tổng tiền: {showAsMoney(totalCost + '')} đồng</Text>
                    <Text style = {styles.text}>Giảm giá: {showAsMoney(discount + '')} đồng</Text>
                    <Text style = {styles.text}>Số tiền phải thanh toán: {showAsMoney((parseInt(totalCost) - parseInt(discount)) + '')} đồng</Text>
                    <Text style = {{fontStyle: 'italic', fontSize: 14, margin: 10, textAlign: 'center'}}>Vui lòng đợi và nhận hàng trong vòng 30 phút!</Text>
                </View>
                <TouchableOpacity style = {styles.button} onPress = {() => {
                    navigation.pop();
                }}>
                    <Text style = {{fontSize: 16, fontWeight: 'bold'}}>Quay lại màn hình chính</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
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
        backgroundColor: '#42b883',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});