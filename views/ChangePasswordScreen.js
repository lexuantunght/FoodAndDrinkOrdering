import React, { useState } from 'react';
import {View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {Host} from '../controllers/Host';
import { Loader } from '../components/Loader';

export function ChangePasswordScreen({navigation}) {
    const[curPassword, setCurPassword] = useState('');
    const[newPassword, setNewPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    const[showLoader, setShowLoader] = useState(false);
    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <Loader loading = {showLoader}/>
                <ScrollView>
                    <Text style = {styles.title}>Mật khẩu cũ</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Mật khẩu cũ' secureTextEntry = {true} textContentType = 'password' onChangeText = {text => setCurPassword(text)}/>
                    <Text style = {styles.title}>Mật khẩu mới</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Mật khẩu mới' secureTextEntry = {true} textContentType = 'password' onChangeText = {text => setNewPassword(text)}/>
                    <Text style = {styles.title}>Xác nhận mật khẩu</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Nhập lại mật khẩu mới' secureTextEntry = {true} textContentType = 'password' onChangeText = {text => setConfirmPassword(text)}/>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        if (isEmptyOrSpaces(curPassword) || isEmptyOrSpaces(newPassword) || isEmptyOrSpaces(confirmPassword)) {
                            showAlert('Thất bại', 'Chưa nhập đầy đủ thông tin!')
                        }
                        else if (newPassword != confirmPassword) {
                            showAlert('Thất bại', 'Mật khẩu xác nhận không khớp!')
                        } else {
                            setShowLoader(true);
                            fetch(Host + '/users/updatePasscode', {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    'currentPasscode': curPassword,
                                    'passcode': newPassword,
                                    'passcodeConfirm': confirmPassword
                                })
                            })
                            .then(response => response.json())
                            .then(json => {
                                setShowLoader(false);
                                console.log(json);
                                if (json.status == 'success') {
                                    Alert.alert(
                                        'Thông báo',
                                        'Thay đổi mật khẩu thành công!',
                                        [
                                          { text: 'OK', onPress: () => navigation.pop() }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                                else {
                                    showAlert('Error', json.message);
                                }
                            })
                            .catch((error) => console.log(error));
                        }
                    }}>
                        <Text style = {{fontSize: 16, fontWeight: 'bold'}}>Thay đổi mật khẩu</Text>
                    </TouchableOpacity>
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

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

const styles = StyleSheet.create({
    textInput: {
        height: 49,
        borderWidth: 1,
        borderRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        fontSize: 16
    },
    button: {
        height: 49,
        margin: 10,
        backgroundColor: '#42b883',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        marginTop: 10,
        fontSize: 13,
        marginLeft: 10,
        marginBottom: 5
    }
});