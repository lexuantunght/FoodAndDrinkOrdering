import React from 'react';
import { Host } from './Host';
import { showAlert } from '../components/CustomAlert';

export const getAll = (done) => {
    fetch(Host + '/items')
    .then(response => response.json())
    .then(json => {
        if (json.status == 'success') {
            done(json.data);
        }
        else {
            showAlert('Error', 'Lỗi kết nối');
        }
    })
    .catch((error) => showAlert('Error', error.toString()));
}