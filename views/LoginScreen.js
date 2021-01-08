import React, { useState } from 'react';
import {
    View, Text, SafeAreaView, 
    StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar, KeyboardAvoidingView
} from 'react-native';

import { LoginTextInput } from '../components/LoginTextInput';
import { authenticate } from '../controllers/AuthController';
import { Loader } from '../components/Loader';

export function LoginScreen({navigation, parentNavigation}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const[showLoader, setShowLoader] = useState(false);

    return(
        <KeyboardAvoidingView style = {{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : undefined}>
            <StatusBar barStyle = 'dark-content'/>
            <SafeAreaView style = {styles.container}>
                <Loader loading = {showLoader}/>
                <Image source = {require('../resources/logo.png')} style = {styles.logo} resizeMode = 'stretch'/>
                <View>
                    <LoginTextInput placeHolder = 'Tên tài khoản' icon = {require('../resources/user.png')} changeText = {text => setUsername(text)}/>
                    <LoginTextInput placeHolder = 'Mật khẩu' icon = {require('../resources/lock.png')} secured = {true} changeText = {text => setPassword(text)}/>
                    <TouchableOpacity style = {styles.button} onPress = {() => { 
                        setShowLoader(true);
                        authenticate(username, password, () => parentNavigation.navigate('Main'), () => setShowLoader(false));
                    }}>
                        <Text style = {styles.textInSide}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                <View style = {styles.footer}>
                    <View style = {{flex: 1, alignItems: 'center', flexDirection: 'row', alignSelf: 'center'}}>
                        <Text style = {{margin: 5, fontSize: 15, fontStyle: 'italic'}}>Bạn chưa có tài khoản?</Text>
                        <TouchableOpacity onPress = {() => {
                            navigation.navigate('Register');
                        }}>
                            <Text style = {{fontWeight: 'bold', fontSize: 15}}>Hãy đăng kí</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    logo: {
        width: Dimensions.get('window').width - 50,
        height: Dimensions.get('window').width - 50,
        alignSelf: 'center',
    },
    login: {
        flex: 1,
    },
    button: {
        height: 49,
        borderRadius: 24,
        alignSelf: 'center',
        backgroundColor: '#42b883',
        justifyContent: 'center',
        margin: 5,
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
        fontSize: 17, 
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold'
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#000000',
        position: 'absolute',
        height: 49,
        left: 0, 
        top: Dimensions.get('window').height - 49, 
        width: Dimensions.get('window').width,
    }
});