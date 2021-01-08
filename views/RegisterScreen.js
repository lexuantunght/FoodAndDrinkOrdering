import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, 
    StyleSheet, Image, Dimensions, TextInput, TouchableOpacity, 
    Alert, StatusBar, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { Host } from '../controllers/Host';
import { LoginTextInput } from '../components/LoginTextInput';
import { showAlert } from '../components/CustomAlert';
import { register } from '../controllers/AuthController';
import { RegisterInfo } from '../models/RegisterInfo';

export function RegisterScreen({navigation}) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    return(
        <KeyboardAvoidingView style = {{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <SafeAreaView style = {styles.container}>
                <ScrollView>
                    <Image source = {require('../resources/membership.png')} style = {styles.logo} resizeMode = 'stretch'/>
                    <Text style = {styles.textTitle}>Thông tin liên hệ</Text>
                    <LoginTextInput placeHolder = 'Họ tên' icon = {require('../resources/name.png')} changeText = {text => setName(text)}/>
                    <LoginTextInput placeHolder = 'Điện thoại' icon = {require('../resources/phone.png')} changeText = {text => setPhone(text)}/>
                    <LoginTextInput placeHolder = 'Email' icon = {require('../resources/email.png')} changeText = {text => setEmail(text)}/>
                    <Text style = {styles.textTitle}>Thông tin đăng nhập</Text>
                    <LoginTextInput placeHolder = 'Tên tài khoản' icon = {require('../resources/user.png')} changeText = {text => setUsername(text)}/>
                    <LoginTextInput placeHolder = 'Mật khẩu' icon = {require('../resources/lock.png')} secured = {true} changeText = {text => setPassword(text)}/>
                    <LoginTextInput placeHolder = 'Xác nhận mật khẩu' icon = {require('../resources/lock.png')} secured = {true} changeText = {text => setConfirmPassword(text)}/>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                            let registerInfo = new RegisterInfo(name, phone, email, username, password, confirmPassword);
                            register(registerInfo, () => {
                                Alert.alert(
                                    'Success',
                                    'Đăng ký thành công! Bắt đầu đăng nhập?',
                                    [
                                      { text: 'OK', onPress: () => navigation.pop() },
                                      { text: 'Cancel', onPress: () => null }
                                    ],
                                    { cancelable: false }
                                );
                            });
                        }}>
                            <Text style = {styles.textInSide}>Đăng ký</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{marginBottom: 20, marginTop: 20}} onPress = {() => { navigation.pop(); }}>
                        <Text style = {styles.textInSide}>Huỷ</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    button: {
        height: 49,
        borderRadius: 24,
        alignSelf: 'center',
        backgroundColor: '#42b883',
        justifyContent: 'center',
        margin: 10,
        width: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textInSide: {
        fontSize: 16, 
        textAlign: 'center', 
        fontWeight: 'bold'
    },
    backButton: {
        justifyContent: 'center',
        margin: 10
    },
    textTitle: {
        fontSize: 15,
        margin: 10,
        fontWeight: '700'
    },
    logo: {
        margin: 10,
        width: 270,
        height: 195,
        alignSelf: 'center'
    },
});