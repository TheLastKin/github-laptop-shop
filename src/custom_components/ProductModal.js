import React, { useState, useContext, useEffect } from 'react';
import { Modal, View, StyleSheet, Dimensions, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, useTheme } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import { CollapsibleHeaderScrollView } from 'react-native-collapsible-header-views';
import StarRating from './StarRating';
import { product_background2 } from '../images';
import {AuthContext} from '../navigation/AuthProvider';
import ComsModal from './ComsModal';

const ProductModal = ({item, visible, dismiss}) => {
    const [showMore, setShowMore] = useState(false);
    const {user} = useContext(AuthContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const [userFavorite, setUserFavorite] = useState({});
    const theme = useTheme();
    let isAdding = false;
    let isTogglingFavorite = false;

    useEffect(() => {
        getUserFavorite();
    }, []);

    const getUserFavorite = async () => {
        await fetch('http://10.0.2.2:4000/api/user/isFavorite/' + user._id + '/' + item._id)
            .then(res => res.json())
            .then(json => setUserFavorite(json))
            .catch(e => console.error(e));
    }

    const dismissModal = () => {
        setModalVisible(false);
    }

    const toggleFavorite = async () => {
        if (isTogglingFavorite){
            return;
        }
        isTogglingFavorite = true;
        let result = null;
        if(userFavorite){
            await fetch('http://10.0.2.2:4000/api/user/removeFavorite/' + userFavorite._id)
                .catch(e => console.error(e));
        }else{
            await fetch('http://10.0.2.2:4000/api/user/addFavorite/' + user._id + '/' + item._id)
                .then(res => res.json())
                .then(json => result = json)
                .catch(e => console.error(e));
            if(result){
                setModalMessage({ message: "Đã thêm vào danh sách yêu thích!", iconName: "check-circle" });
                setModalVisible(true);
            }
        }
        await getUserFavorite();
        isTogglingFavorite = false;
    }

    const addToCart = async () => {
        if(isAdding){
            return;
        }
        isAdding = true;
        let result = {};
        if(item.quantity != 0){
            await fetch('http://10.0.2.2:4000/api/user/addToCart/' + user._id + '/' + item._id + '/1')
                .then(res => res.json())
                .then(json => result = json)
                .catch(e => console.error(e));
        }else{
            setModalMessage({ message: "Sản phẩm này đã hết hàng!", iconName: "x-octagon" });
            setModalVisible(true);
            isAdding = false;
            return;
        }
        if (result.alreadyInCart){
            setModalMessage({ message:"Sản phẩm này đã có trong giỏ hàng của bạn!", iconName: "alert-circle" });
        }else if(result.product){
            setModalMessage({ message:"Đã thêm vào giỏ hàng!", iconName:"check-circle" });
        }else{
            setModalMessage({ message:"Thêm vào giỏ hàng thất bại, hãy thử lại sau!", iconName:"x-octagon"});
        }
        setModalVisible(true);
        isAdding = false;
    }

    const formatPrice = () => {
        return item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const fakeDiscountPrice = () => {
        return (item.price * 0.95).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatDescription = () => {
        item.description = item.description.replace(/\\n/g, '\n').replace(/\\r/g, '\r');
        if(showMore){
            return (
                <View style={[styles.product_description, {borderColor: theme.colors.text}]}>
                    <Text style={[styles.description_text, {color: theme.colors.text}]}>{item.description}</Text>
                    <Text style={styles.toggle_text} onPress={() => setShowMore(false)}>...Thu gọn</Text>
                </View>
            )
        }else{
            return (
                <View style={[styles.product_description, {borderColor: theme.colors.text}]}>
                    <Text style={[styles.description_text, {color: theme.colors.text}]}>{item.description.substr(0, 200)}</Text>
                    <Text style={styles.toggle_text} onPress={() => setShowMore(true)}>...Xem thêm</Text>
                </View>
            )
        }
    }

    const collapsibleHeader = () => {
        return (
            <View style={styles.header}>
                <Image style={styles.header_background} resizeMode="cover" source={product_background2}/>
                <Image 
                    style={styles.header_image}
                    resizeMode="contain"
                    source={{ uri: 'http://10.0.2.2:4000/images/' + item.image}}/>
                <TouchableOpacity style={styles.header_top_left} onPress={dismiss}>
                    <Entypo color={Colors.white} name="chevron-small-down" size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.header_top_right} onPress={() => toggleFavorite()}>
                    <Entypo color={Colors.white} name={userFavorite ? "heart" :"heart-outlined"} size={30}/>
                </TouchableOpacity>
            </View>
        )
    }

    return(
        <Modal
            animationType="slide"
            visible={visible}>
            <CollapsibleHeaderScrollView 
                style={styles.container}
                CollapsibleHeaderComponent={collapsibleHeader()}
                headerHeight={220}
                disableHeaderSnap={true}
                headerContainerBackgroundColor={theme.colors.background}
                >
                <View style={[styles.content, {backgroundColor: theme.colors.background}]}>
                    <Text style={[styles.product_name, {color: theme.colors.text}]}>{item.name}</Text>
                    <StarRating rating={item.rating} fontSize={16} starColor={Colors.yellow700} ratingColor={theme.colors.text}/>
                    <View style={styles.price_container}>
                        <Text style={styles.product_price}>{formatPrice()}</Text>
                        <Text style={styles.discounted_price}>{fakeDiscountPrice()}</Text>
                        <Text style={styles.product_currency}>VNĐ</Text>
                    </View>
                    <Text style={[styles.content_header, {color: theme.colors.text, borderColor: theme.colors.text}]}>Thông số kỹ thuật</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Thời gian pin: {item.batteryLife}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Bộ nhớ card đồ họa: {item.graphicCardMemory}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Thương hiệu: {item.brand.name}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Card đồ họa: {item.graphicCard}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>CPU: {item.CPU}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Tốc độ CPU: {item.CPUSpeed}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Dung lượng ổ cứng: {item.diskSpace}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>RAM: {item.RAM}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Độ phân giải: {item.resolution}</Text>
                    <Text style={[styles.content_row, {color: theme.colors.text}]}>Hệ điều hành: {item.OS}</Text>
                    <Text style={[styles.content_header, {color: theme.colors.text, borderColor: theme.colors.text}]}>Mô tả sản phẩm</Text>
                    {item.description.length > 300 ? 
                        formatDescription() : 
                        <View style={[styles.product_description, {borderColor: theme.colors.text}]}>
                            <Text style={[styles.description_text, {color: theme.colors.text, borderColor: theme.colors.background}]}>{item.description}</Text>
                        </View>
                    }
                </View>
            </CollapsibleHeaderScrollView>
            <TouchableOpacity style={styles.order_button} onPress={() => addToCart()}>
                <Text style={styles.order_text}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
            <ComsModal visible={modalVisible} dismiss={dismissModal} message={modalMessage.message} iconName={modalMessage.iconName}/>
        </Modal>
    );
};

export default ProductModal;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: height*0.94,
    },
    header:{
        flexDirection: 'row',
        flex: 1,
    },
    header_background:{
        width: width,
        height: '100%',
        position: 'absolute',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
    },
    header_image:{
        width: '100%',
        height: '100%',
    },
    header_top_left:{
        position: 'absolute',
        left: 15,
        top: 10,
    },
    header_top_right:{
        position: 'absolute',
        right: 15,
        top: 10,
    },
    content:{
        width: width,
        height: 'auto',
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: Colors.white,
    },
    product_name:{
        fontSize: 22,
        color: Colors.black,
        marginBottom: 4,
    },
    price_container:{
        width: '100%',
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 12,
    },
    product_price:{
        fontSize: 28,
        color: Colors.yellow900,
    },
    discounted_price: {
        fontSize: 16,
        color: Colors.yellow800,
        textDecorationLine: 'line-through',
        textAlignVertical: 'bottom',
        marginLeft: 8,
    },
    product_currency:{
        fontSize: 22,
        color: Colors.yellow900,
        marginTop: 5,
        marginLeft: 5,
    },
    content_header:{
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 3,
        marginTop: 15,
    },
    content_row:{
        fontSize: 18,
        marginTop: 8,
        marginHorizontal: 10,
        color: Colors.black,
    },
    product_description:{
        marginTop: 10,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 3,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    description_text:{
        fontSize: 18,
        color: Colors.black,
    },
    toggle_text:{
        fontSize: 18,
        color: Colors.blueA400,
        textAlign: 'right',
    },
    order_button:{
        width: '100%',
        height: height*0.06,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#1429A0"
    },
    order_text:{
        fontSize: 22,
        color: Colors.white,
        fontWeight: 'bold',
    }
})