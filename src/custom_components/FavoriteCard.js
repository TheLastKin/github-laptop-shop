import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import StarRating from './StarRating';
import ComsModal from './ComsModal';
import ProductModal from './ProductModal';

const FavoriteCard = ({ item, removeFavorite }) => {
    const { user } = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [productModalVisble, setProductModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    let isAdding = false;

    const dismissModal = () => {
        setModalVisible(false);
    }

    const dismissProductModal = () => {
        setProductModalVisible(false);
    }

    const addToCart = async () => {
        if (isAdding) {
            return;
        }
        isAdding = true;
        let result = {};
        if (item.quantity != 0) {
            await fetch('http://10.0.2.2:4000/api/user/addToCart/' + user._id + '/' + item._id + '/1')
                .then(res => res.json())
                .then(json => result = json)
                .catch(e => console.error(e));
        } else {
            setModalMessage({ message: "Sản phẩm này đã hết hàng!", iconName: "x-octagon" });
            setModalVisible(true);
            isAdding = false;
            return;
        }
        if (result.alreadyInCart) {
            setModalMessage({ message: "Sản phẩm này đã có trong giỏ hàng của bạn!", iconName: "alert-circle" });
        } else if (result.product) {
            setModalMessage({ message: "Đã thêm vào giỏ hàng!", iconName: "check-circle" });
        } else {
            setModalMessage({ message: "Thêm vào giỏ hàng thất bại, hãy thử lại sau!", iconName: "x-octagon" });
        }
        setModalVisible(true);
        isAdding = false;
    }

    const formatPrice = () => {
        return item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatName = () => {
        if (item.name.length > 30) {
            return item.name.substring(0, 30) + "...";
        } else {
            return item.name;
        }
    }

    return (
        <View style={styles.card}>
            <View>
                <Image
                    style={styles.card_image}
                    source={{ uri: "http://10.0.2.2:4000/images/" + item.image }}
                    width={100}
                    height={100} />
            </View>
            <View style={styles.card_content}>
                <Text style={styles.card_name} onPress={() => setProductModalVisible(true)}>{formatName()}</Text>
                <StarRating rating={item.rating} fontSize={16} starColor={Colors.yellow700} ratingColor={Colors.black} />
                <Text style={styles.card_row}>Giá: {formatPrice()} VNĐ</Text>
                <View style={styles.card_actions}>
                    <Text style={styles.card_delete} onPress={() => removeFavorite(user._id, item._id)}>Xóa</Text>
                    <Text style={styles.add_to_cart} onPress={() => addToCart()}>Thêm vào giỏ</Text>
                </View>
            </View>
            <ComsModal
                visible={modalVisible}
                dismiss={dismissModal}
                message={modalMessage.message}
                iconName={modalMessage.iconName}
            />
            <ProductModal visible={productModalVisble} dismiss={dismissProductModal} item={item}/>
        </View>
    );
};

export default FavoriteCard;

const styles = StyleSheet.create({
    card: {
        width: "100%",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.blueGrey300,
        marginTop: 10,
        backgroundColor: 'white',
    },
    card_content: {
        width: '70%',
        height: '100%',
        paddingRight: 15,
    },
    card_name: {
        fontSize: 18,
    },
    card_row: {
        fontSize: 16,
        marginTop: 4,
    },
    card_image: {
        marginRight: 8,
        alignSelf: 'center'
    },
    card_actions: {
        width: '100%',
        flexDirection: 'row',
        marginTop: 8,
    },
    card_delete: {
        fontSize: 16,
        color: Colors.blueA400,
    },
    add_to_cart:{
        position: 'absolute',
        right: 30,
        fontSize: 16,
        color: Colors.blueA400,
    }
});