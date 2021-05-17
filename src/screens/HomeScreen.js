import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { background } from '../images/index';
import ProductCard from '../custom_components/ProductCard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors, useTheme } from 'react-native-paper';
import PopularLaptop from '../custom_components/PopularLaptop';
import LatestLaptop from '../custom_components/LatestLaptop';

const HomeScreen = () => {
    const [popularLaptops, setPopularLaptops] = useState([]);
    const [latestLaptops, setLatestLaptops] = useState([]);
    const [queriedLatops, setQueriedLaptops] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [searchByBrand, setSearchByBrand] = useState('');
    const [changeContent, setChangeContent] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        fetch('http://10.0.2.2:4000/api/products/laptop/brands')
            .then(res => res.json())
            .then(json => setBrands(json))
            .catch((e) => console.error("Can't fetch brands: ",e));
        fetch('http://10.0.2.2:4000/api/products/laptop/MostViewed')
            .then(res => res.json())
            .then(json => setPopularLaptops(json))
            .catch((e) => console.error("Can't fetch most viewed laptop: ",e));
        fetch('http://10.0.2.2:4000/api/products/laptop/Latest')
            .then(res => res.json())
            .then(json => setLatestLaptops(json))
            .catch((e) => console.error("Can't fetch latest laptops: ",e));
    }, []);

    const onChangeSearchQuery = (text) => {
        setSearchByName(text);
        if (searchByName.length >= 1) {
            setChangeContent(false);
        }
    }

    useEffect(() => {
        if (searchByBrand.length != 0){
            search();
        }else{
            setChangeContent(false);
        }
    }, [searchByBrand]);

    const search = async () => {
        let name = searchByName;
        let brand = searchByBrand;
        if(name.length == 0){
            name = ".*";
        }
        if(brand.length == 0){
            brand = "none";
        }
        await fetch('http://10.0.2.2:4000/api/products/laptop/filter/' + name + '/' + brand + '/none')
            .then(res => res.json())
            .then(json => setQueriedLaptops(json))
            .catch((e) => console.error("Can't fetch filtered laptops: ", e));
        setChangeContent(true);
    }

    const onSeacrhBarFocus = () => {
        if(changeContent){
            return(
                <View>
                    <FlatList
                        style={{ margin: 10 }}
                        data={queriedLatops}
                        renderItem={renderItems}
                        keyExtractor={(item) => item._id}
                    />
                </View>
            )
        }else{
            return(
                <View>
                    <Text style={[styles.headerText, {color: theme.colors.text}]}>Laptop nổi bật</Text>
                    <ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        style={styles.popularLaptopScrollView}
                        contentContainerStyle={{
                            paddingRight: 20,
                        }}>
                        {popularLaptops.map((laptop, index) => {
                            return (
                                <PopularLaptop key={index} item={laptop} />
                            )
                        })}
                    </ScrollView>
                    <Text style={[styles.headerText, {color: theme.colors.text}]}>Dòng laptop mới nhất</Text>
                    <ScrollView
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        style={styles.latestLaptopScrollView}
                        contentContainerStyle={{
                            paddingRight: 20,
                        }}>
                        {latestLaptops.map((laptop, index) => {
                            return (
                                <LatestLaptop key={index} item={laptop} />
                            )
                        })}
                    </ScrollView>
                </View>
            )
        }
    };

    const onBrandSelected = (brand, index) => {
        if(brand == searchByBrand){
            return(
                <TouchableOpacity key={index} style={styles.brand_active} onPress={() => setSearchByBrand('')}>
                    <Text style={{ color: Colors.white }}>{brand}</Text>
                </TouchableOpacity>
            );
        }else{
            return(
                <TouchableOpacity key={index} style={[styles.brand, {backgroundColor: theme.colors.darkBackground}]} onPress={() => setSearchByBrand(brand)}>
                    <Text style={{ color: theme.colors.text }}>{brand}</Text>
                </TouchableOpacity>
            );
        }
    };

    const renderItems = ({ item }) => {
        return (
            <ProductCard item={item}/>
        )
    };
    return(
        <View style={[styles.container, {backgroundColor: theme.colors.darkBackground}]}>
            <View style={styles.tophead}>
                <View style={styles.search_bar}>
                    <TextInput
                        style={[styles.search_box, {backgroundColor: theme.colors.darkBackground}]}
                        placeholder="Tìm kiếm..."
                        placeholderTextColor={theme.colors.text}
                        onChangeText={(text) => onChangeSearchQuery(text)}
                    />
                    <TouchableOpacity style={styles.search_icon} onPress={() => search()}>
                        <MaterialIcons name="search" size={30} color={Colors.grey400} />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    horizontal
                    scrollEventThrottle={1}
                    showsHorizontalScrollIndicator={false}
                    style={styles.brandScrollView}
                    contentContainerStyle={{
                        paddingRight: 20,
                    }}>
                    {brands.map((brand, index) => {
                        return (
                            onBrandSelected(brand.name, index)
                        )
                    })}
                </ScrollView>
            </View>
            <View style={styles.content}>
                {onSeacrhBarFocus()}
            </View>
        </View>
    )
};

export default HomeScreen;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
    },
    background:{
        flex: 1,
        position: 'absolute',
        zIndex: -1,
    },
    hello:{
        fontSize: 20,
        marginTop: 15,
        color: 'white',
        alignSelf: 'center',
    },
    tophead:{
        width: '100%',
        height: 115,
        paddingTop: 15,
        backgroundColor: Colors.blueA400,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    search_bar:{
        width: '95%',
        height: 45,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
    },
    search_icon:{
        position: 'absolute',
        right: 10,
    },
    search_box:{
       flex: 1,
        color: 'black',
        fontSize: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        paddingHorizontal: 10,
    },
    brandScrollView: {
        width: '95%',
        height: 'auto',
        alignSelf: 'center',
        marginTop: 8,
        paddingHorizontal: 5,
    },
    brand: {
        marginRight: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        height: 30,
        borderRadius: 15,
    },
    brand_active:{
        marginRight: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        backgroundColor: Colors.lightBlue400,
        alignItems: 'center',
        height: 30,
        borderRadius: 15,
    },
    content:{
        width: '100%',
        height: 'auto',
    },
    headerText:{
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.black,
        marginTop: 15,
        marginLeft: 20,
        fontFamily: 'san-serif',
    },
    popularLaptopScrollView: {
        width: '100%',
        height: 160,
        alignSelf: 'center',
        marginTop: 8,
    },
    latestLaptopScrollView:{
        width: '100%',
        height: 210,
        alignSelf: 'center',
        marginTop: 8,
    },
})