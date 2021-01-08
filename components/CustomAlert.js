import React from 'react';
import { Alert } from 'react-native';

export function showAlert(title, message) {
    Alert.alert(
        title,
        message,
        [
          { text: 'OK', onPress: () => null }
        ],
        { cancelable: false }
    );
};