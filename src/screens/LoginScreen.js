import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { Colors, Avatar } from 'react-native-paper';
import {background, google_icon, facebook_icon} from '../images/index';
import ProcedureInput from '../custom_components/ProcedureInput';
import ComsModal from '../custom_components/ComsModal';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser, login, loginAsFacebook, loginAsGoogle} = useContext(AuthContext);
    const [showFooter, setShowFooter] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const navigation = useNavigation();

    useEffect(async () => {
        try{
            const user = JSON.parse(await AsyncStorage.getItem('userLoginState'));
            if(user){
                setUser(user);
            }
        }catch(e){
            console.error(e);
        }
    }, []);

    const dismissModal = () => {
        setModalVisible(false);
    }

    const renderFooter = () => {
        if(showFooter){
            return (
                <View style={styles.register}>
                    <Text style={styles.register_left}>Chưa có tài khoản?</Text>
                    <TouchableOpacity>
                        <Text
                            style={styles.register_right}
                            onPress={() => navigation.navigate("Register")}>
                            Đăng ký tại đây
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return null;
        }
    }

    const verifyUserInput = async () => {
        if(username.length == 0 || password.length == 0){
            setModalMessage({ message: "Hãy điền đầy đủ tên tài khoản và mật khẩu!", iconName: "alert-circle" });
        }
        await login(username, password); 
        if(!user){
            setModalMessage({ message: "Sai tên tài khoản hoặc mật khẩu!", iconName: "alert-circle"});
        }
        setModalVisible(true);
    }

    return(
        <View style={styles.container}>
            <View style={styles.brand}>
                <Text style={styles.brand_left}>MY</Text>
                <Text style={styles.brand_right}>Laptop</Text>
            </View>
            <View style={styles.login_form}>
                <Image source={background} style={styles.login_form_background}/>
                <ProcedureInput
                    textColor={Colors.white}
                    borderColor={Colors.white}
                    placeholder="Tên tài khoản..."
                    onChangeText={(text) => setUsername(text)}
                    iconName="user"
                    placeholderTextColor={Colors.white}
                />
                <ProcedureInput
                    textColor={Colors.white}
                    borderColor={Colors.white}
                    placeholder="Mật khẩu..."
                    onChangeText={(text) => setPassword(text)}
                    iconName="lock"
                    secureTextEntry={true}
                    placeholderTextColor={Colors.white}
                />
                <TouchableOpacity style={styles.forgot_password} onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.forgot_password_text}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.login_button} onPress={() => verifyUserInput()}>
                    <Text style={styles.login_button_text}>Đăng nhập</Text>
                </TouchableOpacity>
                <View style={styles.social_button}>
                    <Text style={styles.login_as}>Login as: </Text>
                    <TouchableOpacity onPress={() => loginAsGoogle()}>
                        <Avatar.Image 
                            source={google_icon} 
                            size={50}
                            style={{position: 'relative', left: 10}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => loginAsFacebook()}>
                        <Avatar.Image 
                            source={facebook_icon} 
                            size={50}
                            style={{ position: 'relative', left: 30}}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {renderFooter()}
            <ComsModal visible={modalVisible} dismiss={dismissModal} message={modalMessage.message} iconName={modalMessage.iconName}/>
        </View>
    );
};

export default LoginScreen;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
    brand:{
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'relative',
        bottom: 50,
    },
    brand_left:{
        fontSize: 34,
        color: Colors.blue400,
    },
    brand_right:{
        fontSize: 34,
        color: 'black',
    },
    login_form:{
        width: width*0.94,
        height: height*0.6,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 15,
    },
    login_form_background:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        borderRadius: 50,
    },
    login_text:{
        fontSize: 28,
        color: Colors.blueA400,
        marginTop: 20,
    },
    login_button:{
        width: "60%",
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: Colors.blueA400,
        borderRadius: 2,
    },
    login_button_text:{
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    social_button:{
        width: '100%',
        height: 'auto',
        justifyContent: 'center',
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
    },
    login_as: {
        position: 'absolute',
        left: '10%',
        fontSize: 22,
        color: 'white',
    },
    forgot_password:{
        position: 'relative',
        left: 70,
        marginTop: 18,
    },
    forgot_password_text:{
        fontSize: 16,
        color: 'white',
    },
    register:{
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    register_left:{
        fontSize: 18,
        color: 'black',
    },
    register_right:{
        fontSize: 18,
        color: Colors.blueA400,
        marginLeft: 5,
    }
})