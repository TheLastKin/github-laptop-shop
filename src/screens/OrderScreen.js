/* eslint-disable prettier/prettier */
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { Colors, useTheme } from 'react-native-paper';
import ProductInCart from '../custom_components/ProductInCart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ComsModal from '../custom_components/ComsModal';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
    const {user} = useContext(AuthContext);
    const [productCart, setProductCart] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const navigation = useNavigation();
    const theme = useTheme();

    let isRemoving = false;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchProductCart();
        });
        
        return unsubscribe;
    }, [navigation]);

    const fetchProductCart = async () => {
        await fetch('http://10.0.2.2:4000/api/user/getProductsInCart/' + user._id)
            .then(res => res.json())
            .then(json => setProductCart(json))
            .catch(e => console.error(e));
    }

    const removeProductInCart = async (productCartId) => {
        if(isRemoving) return;

        isRemoving = true;
        let result = null;
        await fetch('http://10.0.2.2:4000/api/productCart/removeProduct/' + productCartId)
            .then(res => res.json())
            .then(json => result = json)
            .catch(e => console.error(e));
        if(result){
            setModalMessage({ message: "Xóa thành công!", iconName: "check-circle" });
        }else{
            setModalMessage({ message: "Thất bại, hãy thử lại sau!", iconName: "x-octagon"});
        }
        setModalVisible(true);
        isRemoving = false;
        await fetchProductCart();
    }

    const dismissModal = () => {
        setModalVisible(false);
    }

    const calculateTotalCost = () => {
        let total = 0;
        for(let i = 0; i < productCart.length; i++){
            total += productCart[i].product.price * productCart[i].quantity;
        }
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const renderItems = ({item}) => {
        return(
            <ProductInCart item={item} fetchProductCart={fetchProductCart} modalAction={removeProductInCart}/>
        );
    }

    const renderContent = () => {
        if(productCart.length == 0){
            return(
                <View style={styles.empty_card}>
                    <MaterialCommunityIcons name="cart-outline" size={100} color={Colors.grey500}/>
                    <Text style={styles.empty_card_text}>oh, trong đây chẳng có gì cả...</Text>
                </View>
            )
        }else{
            return(
                <View style={styles.products}>
                    <FlatList
                        data={productCart}
                        renderItem={renderItems}
                        keyExtractor={(item) => item._id}
                    />
                </View>
            );
        }
    };

    const renderUserInfo = () => {
        let warning = <FontAwesome name="warning" size={18} color={Colors.red700}/>;
        return(
            <View style={[styles.section, {backgroundColor: theme.colors.background}]}>
                <Text style={[styles.user_info, {color: theme.colors.text}]}>SĐT: {user.phoneNumber} {user.phoneNumber=="Chưa có"?warning:null}</Text>
                <Text style={[styles.user_info, {color: theme.colors.text}]}>Địa chỉ người nhận: {user.address} {user.address=="Chưa có"?warning:null}</Text>
            </View>
        );
    }

    const verifyOrderRequest = () => {
        if(productCart.length == 0){
            setModalMessage({ message: "Bạn phải thêm sản phẩm vào giỏ trước khi đặt hàng!", iconName: "alert-circle"});
        }else if(user.phoneNumber == "Chưa có" || user.address == "Chưa có"){
            setModalMessage({ message: "Hãy vui lòng bổ sung đầy đủ địa chỉ và số điện thoại!", iconName: "alert-circle"});
        }else{
            setModalMessage({ message: "Đơn hàng đã được đặt!", iconName: "check-circle" });
        }
        setModalVisible(true);
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.darkBackground}]}>
            <View style={styles.content}>
                {renderUserInfo()}
                <View style={[styles.section, {backgroundColor: theme.colors.background}]}>
                    <Text style={[styles.products_in_cart, {color: theme.colors.text}]}>Sản phẩm trong giỏ</Text>
                    {renderContent()}
                </View>
                <View style={[styles.section, { flexDirection: 'row', backgroundColor: theme.colors.background }]}>
                    <Text style={[styles.total_cost, { width: "35%", color: theme.colors.text }]}>Thành tiền: </Text>
                    <Text style={[styles.total_cost, { width: "65%", textAlign: 'right', color: theme.colors.text }]}>{calculateTotalCost()} VNĐ</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.order_button} onPress={() => verifyOrderRequest()}>
                <Text style={styles.order_text}>Tiến hành đặt hàng</Text>
            </TouchableOpacity>
            <ComsModal 
                visible={modalVisible} 
                dismiss={dismissModal} 
                message={modalMessage.message} 
                iconName={modalMessage.iconName}  
            />
        </View>
    );
};
export default OrderScreen;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content:{
        width: width,
        padding: 10,
    },
    section:{
        width: '100%',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.white,
        shadowColor: Colors.grey800,
        shadowRadius: 5,
        elevation: 10,
        marginTop: 10,
        zIndex: 0,
    },
    user_info:{
        fontSize: 18,
        marginTop: 4,
    },
    empty_card:{
        width: '100%',
        minHeight: height * 0.52,
        maxHeight: height - 345,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty_card_text:{
        marginTop: 10,
        fontSize: 20,
        color: Colors.grey700,
    },
    products_in_cart:{
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 10,
    },
    products:{
        width: '100%',
        minHeight: height*0.52,
        maxHeight: height - 345,
        justifyContent: 'center',
    },
    total_cost:{
        fontSize: 20,
        color: Colors.black,
    },
    order_button: {
        position: 'absolute',
        bottom: 5,
        width: width,
        height: 50,
        backgroundColor: Colors.blueA400,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    order_text:{
        fontSize: 22,
        color: Colors.white,
    },
})