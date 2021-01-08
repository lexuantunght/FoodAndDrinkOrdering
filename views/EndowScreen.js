import React, { useEffect, useState } from 'react';
import {
    View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, 
    ScrollView, Image, FlatList, Dimensions, Alert
} from 'react-native';
import {Host, HostName} from '../controllers/Host';
import { FlatGrid } from 'react-native-super-grid';

export function EndowScreen() {
    const[data, setData] = useState([]);
    const[dataFilter, setDataFilter] = useState([]);
    useEffect(() => {
        fetch(Host + '/voucher/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
            if (json.status == 'success') {
                setData(json.data);
                setDataFilter(json.data);
            }
        })
        .catch((error) => showAlert('Error', error.toString()));
    }, []);

    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <View style = {styles.searchBar}>
                    <Image source = { require('../resources/search.png') } style = {{width: 18, height: 18, alignItems: 'center', margin: 10, tintColor: '#aaaaaa'}}/>
                    <TextInput placeholder = 'Tìm kiếm' style = {{flex: 1, fontSize: 17, color: '#000000'}} placeholderTextColor = '#aaaaaa' onChangeText = {text => {
                        setDataFilter(filterBySearch(text, data));
                    }}/>
                </View>
                {
                    data.length > 0 ? (
                        <FlatGrid style = {{flex: 1}} data = {dataFilter} itemDimension = {Dimensions.get('window').width / 2 - 30} spacing = {10}
                        renderItem = {({item}) => (
                            <View style = {{backgroundColor: '#42b88370'}}>
                                <Item id = {item.id} name = {item.name} count = {item.count}/>
                            </View>
                        )} 
                        keyExtractor = {item => item.id}/>
                    ) : (
                        <Text style = {{fontSize: 17, color: 'gray', textAlign: 'center', marginTop: 30}}>Bạn không có voucher nào</Text>
                    )
                }
            </SafeAreaView>
        </View>
    );
};

function filterBySearch(keyword, data) {
    var temp = [];
    for (var i of data) {
        if ((i.name).includes(keyword)) {
            temp.push(i);
        }
    }
    return temp;
};

const Item = ({id, name, count}) => {
    return(
        <View style = {styles.item}>
            <Image style = {styles.imageCover} source = {{uri: HostName + '/reservation/vouchers/' + id + '.png'}} resizeMode = 'stretch'/>
            <Text style = {styles.nameItem}>{name}</Text>
            <Text style = {styles.nameItem}>Số lượng: {count}</Text>
        </View>
    );
};

function showAlert(title, message) {
    Alert.alert(
        title,
        message,
        [
          { text: 'OK', onPress: () => null }
        ],
        { cancelable: false }
      );
};

const styles = StyleSheet.create({
    textTitle: {
        fontSize: 17, fontWeight: 'bold', margin: 10
    },
    searchBar: {
        height: 38,
        alignSelf: 'center',
        margin: 10,
        borderRadius: 19,
        backgroundColor: '#dddddd',
        color: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        padding: 5,
        height: 150
    },
    imageCover: {
        flex: 1
    },
    nameItem: {
        fontSize: 13,
        marginTop: 5,
    },
})