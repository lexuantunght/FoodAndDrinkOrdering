import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, StyleSheet, 
    TextInput, Alert, KeyboardAvoidingView, Modal, Dimensions
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { FlatGrid } from 'react-native-super-grid';
import { Host, HostName } from '../controllers/Host';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Loader } from '../components/Loader';

export function ReservedScreen({navigation}) {
    const isFocused = useIsFocused();
    const refRBSheet = useRef();
    const refRBSheetVoucher = useRef();
    const refAddress = useRef();
    const [dataChoosen, setDataChoosen] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [addressShipping, setAddressShipping] = useState('');
    const [message, setMessage] = useState('');
    const [changeCount, setChangeCount] = useState(false);
    const [pointUsable, setPointUsable] = useState(0);
    const [selectValue, setSelectValue] = useState(0);
    const [exchange, setExchange] = useState(1000);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(-1);
    const [discountByVoucher, setDiscountByVoucher] = useState(0);
    const [showLoader, setShowLoader] = useState(false);
    //voucher
    useEffect(() => {
        fetch(Host + '/voucher/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
            if (json.status == 'success') {
                setVouchers(json.data);
            } else {
                setVouchers([]);
            }
        })
        .catch((error) => showAlert('Error', error.toString()));
    }, [isFocused]);
    // chosen item
    useEffect(() => {
        fetch(Host + '/chosen_items', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
            if (json.status == 'success') {
                setDataChoosen(json.data);
                var temp = 0;
                for (var e of json.data) {
                    temp += (parseInt(e.count) * parseInt(e.cost));
                }
                setTotalCost(temp);
            } else {
                setDataChoosen([]);
            }
        })
        .catch((error) => console.log(error));
    }, [changeCount, isFocused]);
    //get point
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
            if (res === 'fail') {
                showAlert('Error', 'Lỗi kết nối!');
            }
            else {
                setPointUsable(json.data.pointUsable);
                var point = parseInt(json.data.pointUsable);
                if (point >= 500 && point < 1000) {
                    setExchange(1200);
                } else if (point >= 1000 && point < 2000) {
                    setExchange(1500);
                } else if (point >= 2000) {
                    setExchange(2000);
                }
            }
        })
        .catch((error) => console.log(error));
    }, [isFocused]);
    if (totalCost > 0 && dataChoosen.length > 0) {
    return(
        <KeyboardAvoidingView style = {{flex: 1}} behavior={Platform.OS == "ios" ? "padding" : "height"}>
            <SafeAreaView style = {{flex: 1, backgroundColor: '#ffffff'}}>
                <Loader loading = {showLoader}/>
                <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} height = {280} dragFromTopOnly = {true} customStyles = {{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }
                }} onClose = {() => {
                    setDiscount(selectValue / 100 * exchange);
                }}>
                    <View>
                        <Text style = {styles.textTitle}>Số điểm khả dụng: {pointUsable}</Text>
                        <Text style = {styles.textTitle}>Số điểm đã chọn: {selectValue}</Text>
                        <Text style = {styles.textTitle}>Số tiền được đổi: {selectValue / 100 * exchange}</Text>
                        <Slider minimumValue = {0} maximumValue = {pointUsable} step = {100} 
                        minimumTrackTintColor = '#42b883' thumbTintColor = '#42b883' style = {styles.slider} value = {discount * 100 / exchange}
                        onValueChange = {value => {
                            setSelectValue(value);
                        }}/>
                    </View>
                </RBSheet>
                <RBSheet ref={refRBSheetVoucher} closeOnDragDown={true} closeOnPressMask={true} height = {280} dragFromTopOnly = {true} customStyles = {{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }
                }} onClose = {() => {
                    if (selectedVoucher != -1) {
                        for (var i of vouchers) {
                            if (i.id == selectedVoucher) {
                                setDiscountByVoucher(i.point);
                                break;
                            }
                        }
                    }
                }}>
                    <View style = {{flex: 1}}>
                        {
                            vouchers.length > 0 ? (
                                <View style = {{flex: 1, padding: 10}}>
                                    <FlatGrid style = {{flex: 1}} data = {vouchers} spacing = {10}
                                    renderItem = {({item}) => (
                                        <TouchableOpacity style = {{backgroundColor: '#e0ece495', borderWidth: 2, borderColor: (item.id == selectedVoucher) ? '#42b883' : '#ffffff', borderRadius: 4}} onPress = {() => {
                                            setSelectedVoucher(item.id);
                                        }}>
                                            <Item id = {item.id} name = {item.name} count = {item.count}/>
                                        </TouchableOpacity>
                                    )} 
                                    keyExtractor = {item => item.id}/>
                                    <TouchableOpacity style = {styles.btnCancelVoucher} onPress = {() => {
                                        setSelectedVoucher(-1);
                                        setDiscountByVoucher(0);
                                    }}>
                                        <Image source = {require('../resources/cross.png')} style = {{width: 16, height: 16, marginRight: 10}} resizeMode = 'stretch'/>
                                        <Text>Huỷ chọn</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style = {{fontSize: 16, color: 'gray', alignSelf: 'center', marginTop: 30}}>Bạn không có voucher nào</Text>
                            )
                        }
                    </View>
                </RBSheet>
                <View style = {styles.headerList}>
                    <Text style = {styles.textHeaderList}>Đã chọn</Text>
                    <Text style = {styles.textHeaderList}>Số lượng</Text>
                    <Text style = {styles.textHeaderList}>Thành tiền</Text>
                </View>
                <FlatList style = {{flex: 1, marginBottom: 10}} data = {dataChoosen} keyExtractor = {item => item.id + ''} ItemSeparatorComponent = {() => (<View style = {{height: 10, backgroundColor: '#ffffff', marginLeft: 10, marginRight: 10}}/>)} renderItem = {({item}) => (
                    <View style = {styles.item}>
                        <View style = {{flex: 1}}>
                            <Image style = {{width: 50, height: 50}} source = {{uri: HostName + '/reservation/images/' + item.avatar}} resizeMode = 'stretch'/>
                            <Text style = {styles.textItem}>{item.name}</Text>
                            <Text style = {styles.textItem}>{showAsMoney(item.cost + '')} đ</Text>
                        </View>
                        <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
                            <View style = {{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0.5, width: 110, height: 36, borderRadius: 5}}>
                                <TouchableOpacity style = {{borderRightWidth: 0.5, flex: 1, justifyContent: 'center', alignItems: 'center', height: 32}} onPress = {() => {
                                    if (item.count > 1) {
                                        fetch(Host + '/items/' + item.id + '/chosen_item', {
                                            method: 'PATCH',
                                            credentials: 'include',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                count: -1,
                                            })
                                        })
                                        .then(response => response.json())
                                        .then(json => {
                                            if (json.status == 'fail') {
                                                showAlert('Error', 'Lỗi kết nối!');
                                            }
                                            else {
                                                console.log(json);
                                                setChangeCount(!changeCount);
                                            }
                                        })
                                        .catch((error) => console.log(error));
                                    }
                                }}>
                                    <Image source = {require('../resources/minus.png')} style = {{width: 20, height: 20}} resizeMode = 'stretch'/>
                                </TouchableOpacity>
                                <View style = {{flex: 1, justifyContent: 'center', height: 32}}>
                                    <Text style = {{fontSize: 17, textAlign: 'center'}}>{item.count}</Text>
                                </View>
                                <TouchableOpacity style = {{flex: 1, borderLeftWidth: 0.5, justifyContent: 'center', alignItems: 'center', height: 32}} onPress = {() => {
                                    if (item.count < 99) {
                                        fetch(Host + '/items/' + item.id + '/chosen_item', {
                                            method: 'PATCH',
                                            credentials: 'include',
                                            headers: {
                                                'Accept': 'application/json',
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                count: 1,
                                            })
                                        })
                                        .then(response => response.json())
                                        .then(json => {
                                            if (json.status == 'fail') {
                                                showAlert('Error', 'Lỗi kết nối!');
                                            }
                                            else {
                                                console.log(json);
                                                setChangeCount(!changeCount);
                                            }
                                        })
                                        .catch((error) => console.log(error));
                                    }
                                }}>
                                    <Image source = {require('../resources/plus.png')} style = {{width: 20, height: 20}} resizeMode = 'stretch'/>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style = {styles.btnDelete} onPress = {() => {
                                fetch(Host + '/chosen_items/' + item.id + '/delete', {
                                    method: 'DELETE',
                                    credentials: 'include',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    }
                                })
                                .then(response => response.json())
                                .then(json => {
                                    if (json.status == 'success') {
                                        console.log(json);
                                        setChangeCount(!changeCount);
                                    }
                                    else {
                                        showAlert('Error', json.message);
                                    }
                                })
                                .catch((error) => console.log(error));
                            }}>
                                <Image source = {require('../resources/trash.png')} style = {{width: 20, height: 20, marginRight: 5}}/>
                                <Text style = {{fontWeight: '600', fontSize: 15}}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                        <View style = {{flex: 1, justifyContent: 'center'}}>
                            <Text style = {{fontSize: 16, marginLeft: 25}}>{showAsMoney((parseInt(item.cost) * item.count) + '')} đ</Text>
                        </View>
                    </View>
                )}/>
                <View>
                    <View style = {{flexDirection: 'row', margin: 10}}>
                        <TouchableOpacity style = {styles.btnDiscount} disabled = {(totalCost > 0 ? false : true)} onPress = {() => {
                            if (parseInt(pointUsable) < 100) {
                                showAlert('Failed', 'Điểm khả dụng phải đạt tối thiểu 100!');
                            }
                            else {
                                refRBSheet.current.open();
                            }
                        }}>
                            <Image source = {require('../resources/exchange.png')} style = {{width: 18, height: 18, marginRight: 5}}/>
                            <Text>Đổi điểm tiêu dùng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.btnDiscount} disabled = {(totalCost > 0 ? false : true)} onPress = {() => {
                            refRBSheetVoucher.current.open();
                        }}>
                            <Image source = {require('../resources/voucher.png')} style = {{width: 18, height: 18, marginRight: 5}}/>
                            <Text>Sử dụng voucher</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style = {styles.textFooter}>Tổng tiền: {showAsMoney(totalCost + '')} đồng</Text>
                    <Text style = {styles.textFooter}>Giảm giá: {showAsMoney((discount + discountByVoucher > totalCost ? totalCost : (discount + discountByVoucher)) + '')} đồng</Text>
                    <Text style = {styles.textFooter}>Còn lại: {showAsMoney((totalCost - discount - discountByVoucher > 0 ? (totalCost - discount - discountByVoucher) : 0) + '')} đồng</Text>
                    <TextInput ref = {refAddress} style = {styles.textInput} placeholder = 'Địa chỉ giao hàng (bắt buộc)' autoCorrect = {false} onChangeText = {text => setAddressShipping(text)} value={addressShipping}/>
                    <TextInput style = {styles.textInput} placeholder = 'Lời nhắn/yêu cầu' autoCorrect = {false} onChangeText = {text => setMessage(text)} value={message}/>
                    <TouchableOpacity style = {styles.button} onPress = {() => {
                        if (isEmptyOrSpaces(addressShipping)) {
                            showAlert('Thất bại', 'Chưa nhập địa chỉ giao hàng!');
                            refAddress.current.focus();
                        } else {
                            setShowLoader(true);
                            //use voucher
                            if (selectedVoucher != -1) {
                                fetch(Host + '/voucher/useVoucher', {
                                    method: 'PATCH',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    credentials: 'include',
                                    body: JSON.stringify({
                                        'id': selectedVoucher,
                                    })
                                })
                                .then(response => response.json())
                                .then(json => {
                                    setShowLoader(false);
                                    if (json.status != 'success') {
                                        showAlert('Error', 'Lỗi kết nối!');
                                    }
                                })
                                .catch((error) => console.log(error));
                            }
                            //create bill
                            var d = new Date();
                            fetch(Host + '/bill', {
                                method: 'POST',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({
                                    'addressShipping': addressShipping,
                                    'message': message,
                                    'discount': (discount + discountByVoucher > totalCost ? totalCost : (discount + discountByVoucher)),
                                    'pointUsed': selectValue
                                })
                            })
                            .then(response => response.json())
                            .then(json => {
                                setShowLoader(false);
                                if (json.status == 'success') {
                                    setMessage('');
                                    setAddressShipping('');
                                    navigation.navigate('Bill', {
                                        items: dataChoosen,
                                        addressShipping: addressShipping,
                                        dateOrder: json.data[0].dateOrder,
                                        message: message,
                                        totalCost: totalCost,
                                        discount: (discount + discountByVoucher > totalCost ? totalCost : (discount + discountByVoucher))
                                    });
                                }
                                else {
                                    showAlert('Error', json.message);
                                }
                            })
                            .catch((error) => console.log(error));
                        }
                    }}>
                        <Text style = {{fontSize: 17, fontWeight: '600'}}>Xác nhận order</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
    } else {
        return(
            <SafeAreaView style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style = {{fontSize: 17, color: 'gray'}}>Giỏ hàng trống</Text>
            </SafeAreaView>
        )
    }
}

const Item = ({id, name, count}) => {
    return(
        <View style = {styles.voucher}>
            <Image style = {styles.imageCover} source = {{uri: HostName + '/reservation/vouchers/' + id + '.png'}} resizeMode = 'stretch'/>
            <Text style = {styles.nameItem}>{name}</Text>
            <Text style = {styles.nameItem}>Số lượng: {count}</Text>
        </View>
    );
};

const showAsMoney = (money) => {
    var index = 0;
    var result = '';
    while (index < money.length)
    {
      var i = money.length - 1 - index;
      result += money[i];
      index += 1;
      if (index < money.length && index % 3 == 0) {
        result += ',';
      }
    }
    return result.split('').reverse().join('');
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
    item: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: '#ffffff',
        padding: 5
    }, 
    headerList: {
        flexDirection: 'row',
        borderRadius: 8,
        height: 49,
        alignItems: 'center',
        margin: 10,
        borderWidth: 2,
        borderColor: '#42b883',
        backgroundColor: '#ffffff'
    },
    textHeaderList: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '500',
    },
    textItem: {
        fontSize: 12,
        marginTop: 3
    },
    textFooter: {
        fontSize: 16, 
        marginLeft: 10,
        marginBottom: 10
    },
    button: {
        height: 49,
        backgroundColor: '#42b883',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    textInput: {
        fontSize: 16,
        height: 49,
        marginLeft: 10, marginRight: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10
    },
    btnDelete: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnDiscount: {
        marginRight: 10,
        backgroundColor: '#42b883',
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    textTitle: {
        fontSize: 15,
        fontWeight: '400',
        margin: 10
    },
    slider: {
        margin: 20
    },
    voucher: {
        padding: 5,
        height: 150,
    },
    imageCover: {
        flex: 1
    },
    nameItem: {
        fontSize: 13,
        marginTop: 5,
    },
    btnCancelVoucher: {
        backgroundColor: '#42b883',
        padding: 10, flexDirection: 'row', marginTop: 10,
        width: 120, height: 40,
        justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 20
    }
});