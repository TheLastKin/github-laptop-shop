import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Text, Dimensions } from 'react-native';
import { Colors, useTheme } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthContext } from '../navigation/AuthProvider';
import ActionModal from './ActionModal';

const ProductInCart = ({item, fetchProductCart, modalAction}) => {
    const { user } = useContext(AuthContext);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const theme = useTheme();
    let isUpdating = false;

    const dismissActionModal = () => {
        setActionModalVisible(false);
    }

    const updateQuantity = async (num) => {
        if(isUpdating){
            return;
        }
        isUpdating = true;
        let updateAmount = item.quantity + num;
        if(updateAmount > 0 && updateAmount <= item.product.quantity){
            await fetch('http://10.0.2.2:4000/api/productCart/updateProduct/' + item._id + '/' + updateAmount)
                .then(res => res.json())
                .catch(e => console.error(e));
            await fetchProductCart();
        }
        isUpdating = false;
    }

    const formatPrice = () => {
        return item.product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatName = () => {
        if (item.product.name.length > 30) {
            return item.product.name.substring(0, 30) + "...";
        } else {
            return item.product.name;
        }
    }

    return(
        <View style={[styles.card, {backgroundColor: theme.colors.background}]}>
            <Image
                style={styles.card_image}
                source={{ uri: "http://10.0.2.2:4000/images/" + item.product.image }}
                width={100}
                height={100} />
            <View style={styles.card_content}>
                <Text style={[styles.card_name, {color: theme.colors.text}]}>{formatName()}</Text>
                <Text style={[styles.card_row, {color: Colors.amber900}]}>Hiện còn {item.product.quantity} sản phẩm</Text>
                <Text style={[styles.card_row, {color: theme.colors.text}]}>Giá: {formatPrice()} VNĐ</Text>
                <View style={styles.card_actions}>
                    <Text style={styles.card_delete} onPress={() => setActionModalVisible(true)}>Xóa</Text>
                    <View style={[styles.quantity_adjustment, {borderColor: theme.colors.text}]}>
                        <Entypo 
                            style={[[styles.quantity_lower, {color: theme.colors.text, borderColor: theme.colors.text}]]} 
                            name="chevron-thin-left" 
                            size={20}
                            onPress={() => updateQuantity(-1)}
                        />
                        <Text style={[styles.card_quantity, {color: theme.colors.text}]}>{item.quantity}</Text>
                        <Entypo 
                            style={[styles.quantity_increase, {color: theme.colors.text, borderColor: theme.colors.text}]} 
                            name="chevron-thin-right" 
                            size={20}
                            onPress={() => updateQuantity(1)}
                        />
                    </View>
                </View>
            </View>
            <ActionModal
                visible={actionModalVisible}
                dismiss={dismissActionModal}
                message="Bạn có chắc rằng muốn xóa?"
                onConfirm={() => modalAction(item._id)}
            />
        </View>
    );
};

export default ProductInCart;

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
    card_actions:{
        flexDirection: 'row',
        marginTop: 8,
    },
    card_delete:{
        fontSize: 16,
        color: Colors.blueA400,
    },
    quantity_adjustment: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.grey900,
        borderRadius: 8,
    },
    quantity_lower:{
        borderRightWidth: 1,
        borderRightColor: Colors.grey900,
    },
    quantity_increase: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.grey900,
    },
    card_quantity:{
        fontSize: 16,
        marginHorizontal: 5,
    }
});