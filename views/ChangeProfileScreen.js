import React, { useState } from 'react';
import {View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {Host} from '../controllers/Host';
import { Loader } from '../components/Loader';

export function ChangeProfileScreen({navigation, route}) {
    const {name} = route.params;
    const {phone} = route.params;
    const {email} = route.params;
    const[newName, setNewName] = useState(name);
    const[newPhone, setNewPhone] = useState(phone);
    const[newEmail, setNewEmail] = useState(email);
    const [passwordComfirm, setPasswordConfirm] = useState('');
    const[showLoader, setShowLoader] = useState(false);
    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <Loader loading = {showLoader}/>
                <ScrollView>
                    <Text style = {styles.title}>Họ tên</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Họ tên' textContentType = 'name' value = {newName} onChangeText = {text => setNewName(text)}/>
                    <Text style = {styles.title}>Số điện thoại</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Số điện thoại mới' textContentType = 'telephoneNumber' value = {newPhone} onChangeText = {text => setNewPhone(text)}/>
                    <Text style = {styles.title}>Email</Text>
                    <TextInput style = {styles.textInput} placeholder = 'Email mới' textContentType = 'emailAddress' value = {newEmail} onChangeText = {text => setNewEmail(text)}/>
                    <Text style = {styles.title}>Mật khẩu xác nhận</Text>
                    <TextInput style = {styles.passconfirm} placeholder = 'Mật khẩu xác nhận' secureTextEntry = {true} textContentType = 'oneTimeCode' onChangeText = {text => setPasswordConfirm(text)}/>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        if (isEmptyOrSpaces(newName) || isEmptyOrSpaces(newPhone) || isEmptyOrSpaces(newEmail) || isEmptyOrSpaces(passwordComfirm)) {
                            showAlert('Thất bại', 'Chưa nhập đủ thông tin!');
                        }
                        else if (newName == name && newPhone == phone && newEmail == email) {
                            showAlert('Thất bại', 'Thông tin không thay đổi!');
                        } else {
                            setShowLoader(true);
                            fetch(Host + '/users/profile/edit', {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    'name': newName,
                                    'phone': newPhone,
                                    'email': newEmail,
                                    'passcodeConfirm': passwordComfirm
                                })
                            })
                            .then(response => response.json())
                            .then(json => {
                                setShowLoader(false);
                                console.log(json);
                                if (json.status == 'fail') {
                                    showAlert('Error', json.message);
                                }
                                else {
                                    Alert.alert(
                                        'Thông báo',
                                        'Thay đổi thông tin thành công!',
                                        [
                                          { text: 'OK', onPress: () => navigation.pop() }
                                        ],
                                        { cancelable: false }
                                    );
                                }
                            })
                            .catch((error) => console.log(error));
                        }
                    }}>
                        <Text style = {{fontSize: 16, fontWeight: 'bold'}}>Thay đổi</Text>
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
    passconfirm: {
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