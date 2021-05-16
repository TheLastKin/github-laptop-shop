import React, { useState } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Colors } from 'react-native-paper';
import ProductModal from './ProductModal';
import StarRating from './StarRating';

const ProductCard = ({item}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const updateViewCount = async () => {
        openModal();
        await fetch('http://10.0.2.2:4000/api/products/laptop/updateViewCount/' + item._id)
            .catch(e => console.error(e));
    }

    const openModal = () => {
        setModalVisible(true);
    }
    const dismissModal = () => {
        setModalVisible(false);
    }

    const formatName = () => {
        if (item.name.length > 30) {
            return item.name.substring(0, 30) + "...";
        }else{
            return item.name;
        }
    }
    const isAvailable = () => {
        if(item.quantity != 0){
            return <Text style={[styles.cardRow, { color: Colors.blueA400 }]}>Còn hàng</Text>;
        }else{
            return <Text style={[styles.cardRow, { color: Colors.red600 }]}>Hết hàng</Text>
        }
    }
    const formatPrice = () => {
        return item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    return(
        <View style={styles.card}>
            <Image
                style={styles.cardImage}
                source={{ uri: "http://10.0.2.2:4000/images/" + item.image }}
                width={100}
                height={100} />
            <View style={styles.cardContent}>
                <Text style={styles.cardName} onPress={() => updateViewCount()}>{formatName()}</Text>
                <StarRating rating={item.rating} fontSize={14} starColor={Colors.yellow800} ratingColor={Colors.black}/>
                <Text style={styles.cardRow}>Giá: {formatPrice()} VNĐ</Text>
                {isAvailable()}
            </View>
            <ProductModal item={item} visible={modalVisible} dismiss={dismissModal}/>
        </View>
    )
};

export default ProductCard;

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: Colors.blueGrey300,
        marginTop: 10,
        backgroundColor: 'white',
    },
    cardContent:{
        width: '70%',
        height: '100%',
        paddingRight: 15,
    },
    cardName: {
        fontSize: 18,
    },
    cardRow: {
        fontSize: 16,
        marginTop: 4,
    },
    cardImage: {
        marginRight: 8,
        alignSelf: 'center'
    },
});