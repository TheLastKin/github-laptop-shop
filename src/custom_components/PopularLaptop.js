import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { product_background } from '../images';
import { Colors } from 'react-native-paper';
import StarRating from '../custom_components/StarRating';
import ProductModal from './ProductModal';

const PopularLaptop = ({item}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    }
    const dismissModal = () => {
        setModalVisible(false);
    }

    const formatName = () => {
        if (item.name.length > 30) {
            return item.name.substring(0, 25) + "...";
        }else{
            return item.name;
        }
    }
    const formatPrice = () => {
        return item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return(
        <View style={styles.container}>
            <Image style={styles.background} source={product_background}/>
            <View style={styles.content_left}>
                <Text style={styles.product_name} onPress={() => openModal()}>{formatName()}</Text>
                <StarRating rating={item.rating} fontSize={14}/>
                <Text style={styles.product_price}>{formatPrice()} VNĐ</Text>
                <TouchableOpacity style={styles.view_product} onPress={() => openModal()}>
                    <Text style={styles.view_product_text}>Xem Ngay</Text>
                </TouchableOpacity>
            </View>
            <Image style={styles.product_image} source={{uri: 'http://10.0.2.2:4000/images/' + item.image}}/>
            <ProductModal item={item} visible={modalVisible} dismiss={dismissModal}/>
        </View>
    );
};

export default PopularLaptop;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        width: width*0.95,
        height: 165,
        paddingHorizontal: 8,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        marginHorizontal: 10,
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        borderRadius: 15,
        zIndex: -1,
    },
    content_left:{
        width: '50%',
        height: '100%',
        justifyContent: 'center',
    },
    product_image:{
        width: 150,
        height: 150,
    },
    product_name:{
        fontSize: 18,
        color: Colors.white,
    },
    product_price:{
        fontSize: 16,
        color: Colors.white,
        marginTop: 4,
    },
    view_product:{
        marginTop: 10,
        width: 90,
        height: 25,
        backgroundColor: Colors.blueA400,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view_product_text:{
        fontSize: 16,
        color: Colors.white,
    }
})