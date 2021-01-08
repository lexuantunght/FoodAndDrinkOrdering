import React, { useEffect, useState } from 'react';
import {View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Dimensions} from 'react-native';
import * as Progress from 'react-native-progress';
import {useIsFocused} from '@react-navigation/native';

export function MemberRequirementScreen({navigation, route}) {
    const {name} = route.params;
    const {pointCollected} = route.params;
    const [requirePoint, setRequirePoint] = useState(0);
    const [targetRank, setTargetRank] = useState('');
    const [rank, setRank] = useState('');
    const [percent, setPercent] = useState(0.0);
    const isFocused = useIsFocused();
    const data = [
        {
            'id': '1',
            'logo': require('../resources/bronze.png'),
            'name': 'Thành viên Đồng',
            'requirement': 'Đăng ký thành công, nhận ngay huy hiệu đồng',
            'endow': 'Quy đổi giảm giá với mức 100 điểm = 1,000 đ'
        },
        {
            'id': '2',
            'logo': require('../resources/silver.png'),
            'name': 'Thành viên Bạc',
            'requirement': 'Điểm tích lũy đạt 500',
            'endow': 'Quy đổi giảm giá với mức 100 điểm = 1,200 đ'
        },
        {
            'id': '3',
            'logo': require('../resources/gold.png'),
            'name': 'Thành viên Vàng',
            'requirement': 'Điểm tích lũy đạt 1000',
            'endow': 'Quy đổi giảm giá với mức 100 điểm = 1,500 đ'
        },
        {
            'id': '4',
            'logo': require('../resources/platinum.png'),
            'name': 'Thành viên Bạch Kim',
            'requirement': 'Điểm tích lũy đạt 2000',
            'endow': 'Quy đổi giảm giá với mức 100 điểm = 2,000 đ'
        }
    ]

    useEffect(() => {
        if (pointCollected >= 500 && pointCollected < 1000) {
            setTargetRank('Vàng');
            setRequirePoint(1000 - pointCollected);
            setPercent(pointCollected / 1000.00);
            setRank('Bạc');
        } else if (pointCollected >= 1000 && pointCollected < 2000) {
            setTargetRank('Bạch Kim');
            setRequirePoint(2000 - pointCollected);
            setPercent(pointCollected / 2000.00);
            setRank('Vàng');
        } else if (pointCollected < 500) {
            setTargetRank('Bạc');
            setRequirePoint(500 - pointCollected);
            setPercent(pointCollected / 500.00);
            setRank('Đồng')
        } else {
            setRank('Bạch Kim');
            setPercent(1.0);
        }
    }, [isFocused]);

    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1}}>
                <View style = {styles.cardView}>
                    <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source = {require('../resources/profile.png')} style = {{width: 20, height: 20, marginRight: 10}}/>
                    <Text style = {{fontSize: 15, fontWeight: '600'}}>{name}</Text>
                    </View>
                    <Text style = {{fontSize: 15, marginTop: 10}}>Điểm tích lũy: {pointCollected}</Text>
                    <Text style = {{fontSize: 15, marginTop: 10}}>Hạng thành viên: {rank}</Text>
                    <Text style = {{fontSize: 15, marginTop: 10}}>{pointCollected < 2000?('Cần ' + requirePoint + ' điểm để đạt thành viên ' + targetRank):('Bạn đã đạt hạng thành viên cao nhất')}</Text>
                    <Progress.Bar progress = {percent} width = {200} color = '#000000' style = {{alignSelf: 'center', margin: 10}}/>
                </View>
                <FlatList data = {data} ItemSeparatorComponent = {() => (<View style = {styles.separator}/>)} renderItem = {({item}) => (
                    <View style = {{margin: 10}}>
                        <Image source = {item.logo} style = {styles.logo} resizeMode = 'stretch'/>
                        <Text style = {styles.text}>{item.name}</Text>
                        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Image source = {require('../resources/request.png')} style = {{width: 32, height: 32, marginRight: 10}}/>
                            <Text style = {{fontSize: 15}}>{item.requirement}</Text>
                        </View>
                        <View style = {{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                            <Image source = {require('../resources/gift-card.png')} style = {{width: 32, height: 32, marginRight: 10}}/>
                            <Text style = {{fontSize: 15}}>{item.endow}</Text>
                        </View>
                    </View>
                )}
                keyExtractor = {item => item.id}/>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 19,
        marginTop: 5,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    separator: {
        height: 1,
        width: Dimensions.get('screen').width - 20,
        backgroundColor: '#000000',
        alignSelf: 'center'
    },
    logo: {
        width: 120,
        height: 160,
        alignSelf: 'center'
    },
    cardView: {
        backgroundColor: '#42b88370',
        padding: 10,
        margin: 10,
        borderRadius: 8
    }
});