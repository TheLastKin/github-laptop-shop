import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { background } from '../images/index';
import ProductCard from '../custom_components/ProductCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from 'react-native-paper';

const LaptopScreen = () => {
    const { user } = useContext(AuthContext);
    const [products, setProduct] = useState([]);
    const [searchQuery, setQuery] = useState('Laptop');

    useEffect(() => {
        fetch('http://10.0.2.2:4000/api/products/' + searchQuery)
            .then(res => res.json())
            .then(json => setProduct(json))
            .catch((e) => console.log(e));
    }, [searchQuery]);
    const renderItems = ({ item }) => {
        return (
            <ProductCard item={item} />
        )
    }
    return (
        <View>
            <Image style={styles.background} source={background} />
            <View style={styles.search_bar}>
                <TextInput
                    style={styles.search_box}
                    placeholder="Tìm kiếm..."
                    onChangeText={(text) => setQuery(text)}
                />
                <MaterialIcons style={styles.search_icon} name="search" size={30} color={Colors.grey700} />
            </View>
            <FlatList
                style={{ margin: 10 }}
                data={products}
                renderItem={renderItems}
                keyExtractor={(item) => item._id}
            />
        </View>
    )
};

export default LaptopScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        flex: 1,
        position: 'absolute',
        zIndex: -1,
    },
    hello: {
        fontSize: 20,
        marginTop: 15,
        color: 'white',
        alignSelf: 'center',
    },
    search_bar: {
        width: '80%',
        height: 40,
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_icon: {
        position: 'absolute',
        right: 10,
    },
    search_box: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    }
})