import React, { useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import { Avatar, Colors } from 'react-native-paper';
import { sample_avatar } from '../images';
import ProfileScreen from '../screens/ProfileScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrderScreen from '../screens/OrderScreen';
import SettingScreen from '../screens/SettingScreen';
import { AuthContext } from './AuthProvider';
import UpdateInfoScreen from '../screens/UpdateInfoScreen';
import FavoriteProductScreen from '../screens/FavoriteProductScreen';

const Tab = createMaterialBottomTabNavigator();

const HomeStack = createStackNavigator();

const ProfileStack = createStackNavigator();

const MainContainer = () => {
    return(
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="white"
            inactiveColor={Colors.grey200}
            barStyle={{ backgroundColor: Colors.blueA400 }}>
            <Tab.Screen
                name="HomeContainer"
                component={HomeContainer}
                options={{
                    tabBarLabel: 'Trang Chủ',
                    tabBarIcon: ({ color }) => (
                        <IconAntDesign name="home" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen
                name="Order"
                component={OrderScreen}
                options={{
                    tabBarLabel: 'Giỏ Hàng',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="shopping-cart" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen
                name="ProfileContainer"
                component={ProfileContainer}
                options={{
                    tabBarLabel: 'Hồ sơ cá nhân',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="person" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen
                name="Explore"
                component={SettingScreen}
                options={{
                    tabBarLabel: 'Cài Đặt',
                    tabBarIcon: ({ color }) => (
                        <MaterialIcons name="settings" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator>
    )
};

const HomeContainer = () => {
    const {user} = useContext(AuthContext);
    const navigation = useNavigation();
    return(
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: '',
                    headerLeft: () => {
                        return (
                            <TouchableOpacity
                                style={{ flexDirection: 'row', marginLeft: 15 }}
                                onPress={() => navigation.navigate("Home")}>
                                <Text style={{ color: Colors.lightBlue200, fontSize: 20 }}>MY</Text>
                                <Text style={{ color: 'white', fontSize: 20 }}>Laptop</Text>
                            </TouchableOpacity>
                        )
                    },
                    headerRight: () => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("ProfileContainer")}>
                                <Avatar.Image source={{uri: 'http://10.0.2.2:4000/images/' + user.profilePicture}} size={45} style={{ marginRight: 15 }} />
                            </TouchableOpacity>
                        );
                    },
                    headerStyle: { backgroundColor: Colors.blueA400 }
                }}
            />
            <HomeStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    );
};

const ProfileContainer = () => {
    return(
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
            <ProfileStack.Screen
                name="UpdateInfo"
                component={UpdateInfoScreen}
                options={{
                    headerShown: false,
                }}
            />
            <ProfileStack.Screen
                name="FavoriteProducts"
                component={FavoriteProductScreen}
                options={{
                    headerShown: false,
                }}
            />
        </ProfileStack.Navigator>
    )
}
export default MainContainer;