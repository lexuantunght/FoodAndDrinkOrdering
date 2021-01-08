import React from 'react';
import { Host } from './Host';
import { showAlert } from '../components/CustomAlert';

export const authenticate = (username, password, done, finish) => {
    if (isEmptyOrSpaces(username) || isEmptyOrSpaces(password)) {
        finish();
        showAlert('Failed', 'Thông tin đăng nhập chưa đầy đủ!');
    } else {
        fetch(Host + '/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                'username': username,
                'passcode': password,
            })
        })
        .then(response => response.json())
        .then(json => {
            finish();
            if (json.status == 'success') {
                done();
            }
            else {
                showAlert('Đăng nhập thất bại', 'Tên tài khoản hoặc mật khẩu không chính xác!');
            }
        })
        .catch((error) => showAlert('Error', error.toString()));
    }
};

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

export const register = (registerInfo, done) => {
    if (registerInfo.confirmPassword != registerInfo.password) {
        showAlert('Lỗi đăng ký', 'Mật khẩu xác nhận không khớp!');
    }
    else if (registerInfo.nameUser == '' || registerInfo.emailAddress == '' || registerInfo.phoneNumber == '' || registerInfo.username == '' || registerInfo.password == '') {
        showAlert('Lỗi đăng ký', 'Thông tin nhập chưa đầy đủ!')
    }
    else
    {
        fetch(Host + '/users/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': registerInfo.nameUser,
                'phone': registerInfo.phoneNumber,
                'email': registerInfo.emailAddress,
                'username': registerInfo.username,
                'passcode': registerInfo.password,
                'passcodeConfirm': registerInfo.confirmPassword
            })
        })
        .then(response => response.json())
        .then(json => {
            if (json.status == 'success') {
                done();
            }
            else {
                showAlert('Đăng kí thất bại', json.message);
            }
        })
        .catch((error) => showAlert('Error', error.toString()));
    }
}