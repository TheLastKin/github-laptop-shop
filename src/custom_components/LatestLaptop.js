import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native-paper';
import StarRating from './StarRating';
import ProductModal from './ProductModal';

const LatestLaptop = ({item}) => {
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
    const isAvailable = () => {
        if (item.quantity != 0) {
            return <Text style={[styles.product_status, { color: Colors.white }]}>Còn hàng</Text>;
        } else {
            return <Text style={[styles.product_status, { color: Colors.redA400 }]}>Hết hàng</Text>;
        }
    }
    return(
        <View style={styles.container}>
            <View style={styles.product_image_container}>
                <Image 
                    style={styles.product_image} 
                    resizeMode="stretch" 
                    source={{ uri: 'http://10.0.2.2:4000/images/' + item.image }}
                />
            </View>
            <View style={styles.content_bottom}>
                <Text style={styles.product_name}>{formatName()}</Text>
                <StarRating rating={item.rating} fontSize={14} />
                <View style={{flexDirection: 'row', marginTop: 4, width: '100%'}}>
                    <Text style={styles.product_price}>{formatPrice()} VNĐ</Text>
                    {isAvailable()}
                </View>
                <TouchableOpacity style={styles.order_product} onPress={() => openModal()}>
                    <Text style={styles.order_product_text}>Đặt Hàng</Text>
                </TouchableOpacity>
            </View>
            <ProductModal item={item} visible={modalVisible} dismiss={dismissModal}/>
        </View>
    );
};

export default LatestLaptop;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        width: width*0.75,
        height: 210,
        backgroundColor: Colors.white,
        marginHorizontal: 10,
        backgroundColor: 'transparent',
    },
    product_image_container:{
        width: '100%',
        height: 140,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    content_bottom: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        height: 100,
        backgroundColor: Colors.blueA700,
        paddingHorizontal: 10,
        paddingTop: 5,
        borderRadius: 10,
    },
    product_image: {
        position: 'absolute',
        top: -5,
        width: '70%',
        height: 120,
        alignSelf: 'center'
    },
    product_name: {
        fontSize: 18,
        color: Colors.white,
    },
    product_price: {
        fontSize: 16,
        color: Colors.white,
    },
    product_status:{
        position: 'absolute',
        right: 0,
        fontSize: 16,
    },
    order_product: {
        position: 'absolute',
        bottom: -10,
        marginTop: 10,
        width: '90%',
        height: 30,
        backgroundColor: Colors.white,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: Colors.grey800,
        shadowRadius: 5,
        elevation: 5,
    },
    order_product_text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.blueA400,
    }
});