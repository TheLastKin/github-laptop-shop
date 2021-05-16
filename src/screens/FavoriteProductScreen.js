import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import FavoriteCard from '../custom_components/FavoriteCard';
import { View, Dimensions, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import ComsModal from '../custom_components/ComsModal';
import { Colors } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

const FavoriteProductScreen = () => {
    const {user} = useContext(AuthContext);
    const [userFavorites, setUserFavorites] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const navigation = useNavigation();
    let isRemoving = false;
    let isAddingAll = false;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUserFavorite();
        });
        return unsubscribe;
    }, [navigation]);

    const dismissModal = () => {
        setModalVisible(false);
    }

    const addAllToCart = () => {
        if(isAddingAll) return;

        isAddingAll = true;
        let result = false;
        for(let i = 0; i < userFavorites.length; i++){
            if(userFavorites[i].quantity != 0){
                fetch('http://10.0.2.2:4000/api/user/addToCart/' + user._id + '/' + userFavorites[i]._id + '/1')
                    .then(res => res.json())
                    .then(json => { if (json._id) result = json })
                    .catch(e => console.error);
            }
        }
        if(result){
            setModalMessage({ message: "Thêm vào giỏ thành công!", iconName: "check-circle" });
        }else{
            setModalMessage({ message: "Thêm vào giỏ thất bại!", iconName: "x-octagon" });
        }
        setModalVisible(true);
        isAddingAll = false;
    }

    const getUserFavorite = async () => {
        await fetch('http://10.0.2.2:4000/api/user/getFavorites/' + user._id)
            .then(res => res.json())
            .then(json => setUserFavorites(json))
            .catch(e => console.error(e));
    }

    const removeFavorite = async (userId, itemId) => {
        if(isRemoving) return;

        isRemoving = true;
        let result = null;
        await fetch('http://10.0.2.2:4000/api/user/removeFavorite/' + userId + '/' + itemId)
            .then(res => res.json())
            .then(json => result = json)
            .catch(e => console.error(e));
        if(result){
            setModalMessage({ message: "Xóa thành công!", iconName: "check-circle" });
        }else{
            setModalMessage({ message: "Xóa thất bại, hãy thử lại sau.", iconName: "x-octagon" });
        }
        setModalVisible(true);
        isRemoving = false;
        await getUserFavorite();
    }

    const renderItems = ({item}) => {
        return(
            <FavoriteCard item={item} removeFavorite={removeFavorite}/>
        )
    }

    return(
        <View style={styles.container}>
            <Entypo
                style={styles.back}
                name="chevron-thin-left"
                size={25}
                color={Colors.blueA400}
                onPress={() => navigation.navigate("Profile")}
            />
            <View style={styles.products}>
                <Text style={styles.favorite_products}>Sản phẩm yêu thích</Text>
                <FlatList
                    data={userFavorites}
                    renderItem={renderItems}
                    keyExtractor={(item) => item._id}
                />
            </View>
            <TouchableOpacity style={styles.add_all_button} onPress={() => addAllToCart()}>
                <Text style={styles.add_all_text}>Thêm tất cả vào giỏ</Text>
            </TouchableOpacity>
            <ComsModal 
                visible={modalVisible} 
                dismiss={dismissModal} 
                message={modalMessage.message} 
                iconName={modalMessage.iconName}
            />
        </View>
    )
};

export default FavoriteProductScreen;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 10,
    },
    products:{
        width: '100%',
        height: height*0.74,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.white,
        shadowColor: Colors.grey800,
        shadowRadius: 5,
        elevation: 10,
        marginTop: 10,
    },
    favorite_products:{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 10,
    },
    back: {
        marginVertical: 10,
    },
    add_all_button: {
        marginTop: 15,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*0.75,
        height: 50,
        backgroundColor: Colors.blueA400,
        borderRadius: 10,
    },
    add_all_text: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
})