import * as React from 'react';
import {
    View, Image, TextInput, 
    Dimensions,
    StyleSheet
} from 'react-native';

export const LoginTextInput = ({placeHolder, icon, secured, changeText}) => (
    <View style = {styles.container}>
        <Image source = {icon} style = {styles.icon} resizeMode = 'stretch'/>
        <TextInput style = {styles.text} placeholder = {placeHolder} autoCorrect = {false} secureTextEntry = {secured} multiline = {false} onChangeText = {changeText}/>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        paddingLeft: 12, paddingRight: 10, marginBottom: 10,
        borderWidth: 1, borderRadius: 23, height: 46, width: Dimensions.get('screen').width - 40, 
        alignItems: 'center', alignSelf: 'center'
    },
    icon: {
        width: 20, height: 20, resizeMode: 'stretch'
    },
    text: {
        fontSize: 16, marginLeft: 10, width: Dimensions.get('screen').width - 110
    }
});