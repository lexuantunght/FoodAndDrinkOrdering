import React, {useEffect, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image, Alert, ScrollView, TouchableOpacity} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {useIsFocused} from '@react-navigation/native';
import {Host} from '../controllers/Host';

export function ProfileScreen({navigation}) {
    const isFocused = useIsFocused();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [pointCollected, setPointCollected] = useState(0);
    const [pointUsable, setPointUsable] = useState(0);
    const [memberLogo, setMemberLogo] = useState(require('../resources/bronze.png'));
    useEffect(() => {
        fetch(Host + '/users/profile', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
        .then(response => response.json())
        .then(json => {
            let res = json.status;
            if (res === 'success') {
                setName(json.data.name);
                setPhone(json.data.phone);
                setEmail(json.data.email);
                setPointCollected(json.data.pointCollected);
                setPointUsable(json.data.pointUsable);

                var point = parseInt(json.data.pointCollected);

                if (point >= 500 && point < 1000) {
                    setMemberLogo(require('../resources/silver.png'));
                } else if (point >= 1000 && point < 2000) {
                    setMemberLogo(require('../resources/gold.png'));
                } else if (point >= 2000) {
                    setMemberLogo(require('../resources/platinum.png'));
                }
            }
            else {
                showAlert('Error', json.message);
            }
        })
        .catch((error) => console.log(error));
    }, [isFocused]);

    const [activeSections, setActiveSections] = useState([]);
    const SECTIONS = [
        {
          title: (<Text style = {styles.titleButton}>Thông tin & bảo mật</Text>),
          content: (
              <View>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        navigation.navigate('HistoryOrder');
                    }}>
                        <Image source = {require('../resources/history.png')} style = {{width: 25, height: 25, marginRight: 10}} resizeMode = 'stretch'/>
                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Lịch sử order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        navigation.navigate('ChangeProfile', {name: name, phone: phone, email: email});
                    }}>
                        <Image source = {require('../resources/changeinfo.png')} style = {{width: 25, height: 25, marginRight: 10}} resizeMode = 'stretch'/>
                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Đổi thông tin cá nhân</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        navigation.navigate('ChangePassword');
                    }}>
                        <Image source = {require('../resources/changepassword.png')} style = {{width: 25, height: 25, marginRight: 10}} resizeMode = 'stretch'/>
                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Đổi mật khẩu</Text>
                    </TouchableOpacity>
              </View>
          ),
        },
        {
          title: (<Text style = {styles.titleButton}>Hạng thành viên & ưu đãi</Text>),
          content: (
              <View>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        navigation.navigate('MemberRequirement', {name: name, pointCollected: pointCollected});
                    }}>
                        <Image source = {require('../resources/require.png')} style = {{width: 25, height: 25, marginRight: 10}} resizeMode = 'stretch'/>
                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Xem yêu cầu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        navigation.navigate('Endow');
                    }}>
                        <Image source = {require('../resources/gift.png')} style = {{width: 25, height: 25, marginRight: 10}} resizeMode = 'stretch'/>
                        <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Xem ưu đãi</Text>
                    </TouchableOpacity>
              </View>
          ),
        },
    ];

    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <View style = {styles.card}>
                    <Image source = {memberLogo} style = {{width: 70, height: 90, alignSelf: 'center'}} resizeMode = 'stretch'/>
                    <View style = {{flex: 1, marginLeft: 10, borderLeftWidth: 0.5, paddingLeft: 10}}>
                        <Text style = {styles.text}>Họ tên: {name}</Text>
                        <Text style = {styles.text}>Điện thoại: {phone}</Text>
                        <Text style = {styles.text}>Email: {email}</Text>
                        <Text style = {styles.text}>Điểm tích luỹ: {pointCollected}</Text>
                        <Text style = {styles.text}>Điểm khả dụng: {pointUsable}</Text>
                    </View>
                </View>
                 
                <ScrollView>
                    <Accordion expandMultiple = {true} underlayColor = {null}
                        sections={SECTIONS}
                        activeSections={activeSections}
                        renderHeader={(section) => section.title}
                        renderContent={(section) => section.content}
                        onChange={(activeSections) => setActiveSections(activeSections)}
                    />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
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

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: '600'
    },
    title: {
        fontSize: 14,
        margin: 10
    },
    card: {
        flexDirection: 'row', 
        margin: 10, 
        backgroundColor: '#42b88370', 
        padding: 10, 
        borderRadius: 8, 
        height: 180,
        shadowOffset: {width: 1, height: 1},
        shadowRadius: 1,
        shadowOpacity: 0.2
    },
    button: {
        height: 49,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#42b883',
        borderRadius: 8,
        paddingLeft: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleButton: {
        fontSize: 17,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        fontWeight: '700'
    }
});