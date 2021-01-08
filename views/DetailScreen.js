import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert} from 'react-native';
import PageControl from 'react-native-page-control';
import Toast from 'react-native-tiny-toast';
import {Host, HostName} from '../controllers/Host';

export function DetailScreen({navigation, route}) {
    const {itemSelected} = route.params;
    const {idCustomer} = route.params;
    const {token} = route.params;
    const [photos, setPhotos] = useState([]);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [like, setLike] = useState(false);
    const [likeIcon, setLikeIcon] = useState(require('../resources/like.png'));
    const [likeText, setLikeText] = useState('Like');
    const [likeCount, setLikeCount] = useState(parseInt(itemSelected.liked));
    useEffect(() => {
        navigation.setOptions({
            title: itemSelected.name
        });
        fetch(Host + '/items/' + itemSelected.id + '/details_item')
        .then(response => response.json())
        .then(json => {
            if (json.status === 'fail') {
                showAlert('Error', 'Lỗi kết nối!');
            }
            else {
                setPhotos(json.data);
            }
        })
        .catch((error) => console.log(error));

        fetch(Host + '/items/' + itemSelected.id + '/' + idCustomer)
        .then(response => response.json())
        .then(json => {
            if (json.status == 'fail') {
                showAlert('Error', 'Lỗi kết nối!');
            }
            else {
                if (json.liked == '1') {
                    setLike(true);
                    setLikeIcon(require('../resources/unlike.png'));
                    setLikeText('Unlike');
                } else {
                    setLike(false);
                    setLikeIcon(require('../resources/like.png'));
                    setLikeText('Like');
                }
            }
        })
        .catch((error) => console.log(error));
    }, []);
    return(
        <View style = {{flex: 1}}>
            <SafeAreaView style = {{flex: 1, backgroundColor: '#eeeeee'}}>
                <View style = {{height: 240}}>
                <ScrollView style = {styles.scrollView} horizontal = {true} showsHorizontalScrollIndicator = {false} 
                pagingEnabled = {true} 
                onMomentumScrollEnd = {(event) => {
                    setCurrentPhoto(event.nativeEvent.contentOffset.x / (Dimensions.get('window').width - 20));
                }}>
                    <ViewPhotos width = {(Dimensions.get('window').width - 20) * photos.length} height = {240} photos = {photos}/>
                </ScrollView>
                </View>
                <View style = {{height: 40}}>
                    <PageControl style = {styles.pageControl} numberOfPages = {photos.length} currentPage = {currentPhoto} currentPageIndicatorTintColor = '#42b883' pageIndicatorTintColor = '#42b88340'/>
                </View>
                <ScrollView style = {styles.detail}>
                    <Text style = {styles.textInDetail}>Kích thước (size): {itemSelected.nameSize}</Text>
                    <Text style = {styles.textInDetail}>Giá bán: {showAsMoney(itemSelected.cost + '')} đồng</Text>
                    <Text style = {styles.textInDetail}>Mô tả: {itemSelected.description == null ? 'Không' : itemSelected.description}</Text>
                    <Text style = {styles.textInDetail}>Lượt thích: {likeCount}</Text>
                    <View style = {{flexDirection: 'row', marginTop: 10, padding: 10}}>
                    <TouchableOpacity style = {styles.buttonLike} onPress = {() => {
                            var value = 0;
                            if (!like) {
                                value = 1;
                                setLikeIcon(require('../resources/unlike.png'));
                                setLikeText('Unlike');
                            } else {
                                value = -1;
                                setLikeIcon(require('../resources/like.png'));
                                setLikeText('Like');
                            }
                            setLike(!like);
                            fetch(Host + '/items/' + itemSelected.id, {
                                method: 'PATCH',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json', 
                                },
                                body: JSON.stringify({
                                    like: value,
                                })
                            })
                            .then(response => response.json())
                            .then(json => {
                                console.log(json);
                                if (json.status == 'fail') {
                                    showAlert('Error', 'Vui lòng thử lại sau!');
                                } else {
                                    setLikeCount(likeCount + value);
                                }
                            })
                            .catch((error) => showAlert('Error', error.toString()));
                        }}>
                            <Image source = {likeIcon} style = {{width: 20, height: 20, marginRight: 10}} resizeMode = 'stretch'/>
                            <Text style = {{fontSize: 17, textAlign: 'center', fontWeight: 'bold'}}>{likeText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style = {styles.buttonOrder} onPress = {() => {
                            fetch(Host + '/items/' + itemSelected.id + '/chosen_item', {
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
                                    showAlert('Error', 'Vui lòng thử lại sau!');
                                } else {
                                    //showAlert('Thông báo', itemSelected.name + ' đã được thêm vào danh sách order!');
                                    Toast.showSuccess(itemSelected.name + '\nđã được thêm vào danh sách order!');
                                }
                            })
                            .catch((error) => showAlert('Error', error.toString()));
                        }}>
                            <Image source = {require('../resources/order.png')} style = {{width: 20, height: 20, marginRight: 10}} resizeMode = 'stretch'/>
                            <Text style = {{fontSize: 17, textAlign: 'center', fontWeight: 'bold'}}>Order</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

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

const ViewPhotos = ({width, height, photos}) => (
    <View style = {{width: width, height: height, backgroundColor: '#edf7fa', flexDirection: 'row'}}>
        {
            photos.map((images, key)=>{
                return (
                    <Image style={{width: width / photos.length, height: height}} source={{uri: HostName + '/reservation/images/' + images.namephoto}} key = {key} resizeMode = 'stretch'/>
                );
            })
        }
    </View>
);

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

const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      backgroundColor: '#eeeeee'
    },
    pageControl: {
      flex: 1,
      backgroundColor: '#eeeeee',
    },
    item: {
      margin: 10,
    },
    itemText: {
      fontSize: 15,
      marginTop: 5,
      marginBottom: 5
    },
    textInDetail: {
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'justify'
    }, 
    buttonOrder: {
        flex: 5,
        justifyContent: 'center',
        backgroundColor: '#42b883',
        height: 49,
        borderRadius: 8,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonLike: {
        flex: 2,
        justifyContent: 'center',
        backgroundColor: '#42b883',
        height: 49,
        borderRadius: 8,
        marginRight: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
});