import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Dimensions, Keyboard } from 'react-native';
import { Colors, Avatar } from 'react-native-paper';
import { background, google_icon, facebook_icon } from '../images/index';
import ProcedureInput from '../custom_components/ProcedureInput';
import ComsModal from '../custom_components/ComsModal';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reconfirm, setReconfirm] = useState('');
    const [showFooter, setShowFooter] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const {register} = useContext(AuthContext);
    const navigation = useNavigation();

    let isRegistering = false;

    const dismissModal = () => {
        setModalVisible(false);
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const renderFooter = () => {
        if (showFooter) {
            return (
                <View style={styles.register}>
                    <Text style={styles.register_left}>Đã có tài khoản?</Text>
                    <TouchableOpacity>
                        <Text
                            style={styles.register_right}
                            onPress={() => navigation.navigate("Login")}>
                            Đăng nhập ngay
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return null;
        }
    }

    const makeRequest = async () => {
        if(isRegistering){
            return;
        }

        isRegistering = true;

        if (displayName.length == 0 || email.length == 0 || password.length == 0 || reconfirm.length == 0) {
            setModalMessage("Hãy điền đầy đủ các mục trống!");
        } else if (!validateEmail(email)) {
            setModalMessage("Định dạng email không hợp lệ!");
        }else if(password.length < 8){
            setModalMessage("Mật khẩu phải dài hơn 7 kí tự!");
        }else if(password != reconfirm){
            setModalMessage("Xác nhận mật khẩu sai!");
        }else{
            let result = await register(displayName, email, password);
            if(result.userExisted){
                setModalMessage("Email đã được đăng ký!");
            }else if(result.success){
                setModalMessage("Đăng ký thành công!");
                setInterval(() => {
                    navigation.navigate("Login");
                }, 3000);
            }else{
                setModalMessage("Đăng ký thất bại!");
            }
        }
        setModalVisible(true);
        isRegistering = false;
    }

    Keyboard.addListener('keyboardDidHide', () => {
        setShowFooter(true);
    });

    Keyboard.addListener('keyboardDidShow', () => {
        setShowFooter(false);
    });

    return (
        <View style={styles.container}>
            <View style={styles.brand}>
                <Text style={styles.brand_left}>MY</Text>
                <Text style={styles.brand_right}>Laptop</Text>
            </View>
            <View style={styles.register_form}>
                <Image source={background} style={styles.register_form_background} />
                <ProcedureInput
                    placeholder="Tên Hiển Thị..."
                    onChangeText={(text) => setDisplayName(text)}
                    iconName="user"
                />
                <ProcedureInput
                    placeholder="Email..."
                    onChangeText={(text) => setEmail(text)}
                    iconName="envelope"
                />
                <ProcedureInput
                    placeholder="Mật khẩu..."
                    onChangeText={(text) => setPassword(text)}
                    iconName="lock"
                    secureTextEntry={true}
                />
                <ProcedureInput
                    placeholder="Nhập lại mật khẩu..."
                    onChangeText={(text) => setReconfirm(text)}
                    iconName="lock"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.register_button} onPress={() => makeRequest()}>
                    <Text style={styles.register_button_text}>Đăng Ký</Text>
                </TouchableOpacity>
            </View>
            {renderFooter()}
            <ComsModal visible={modalVisible} dismiss={dismissModal} message={modalMessage} />
        </View>
    );
};

export default RegisterScreen;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flex: 1,
    },
    brand: {
        flexDirection: 'row',
        alignSelf: 'center',
        position: 'relative',
        bottom: 50,
    },
    brand_left: {
        fontSize: 34,
        color: Colors.blue400,
    },
    brand_right: {
        fontSize: 34,
        color: 'black',
    },
    register_form: {
        width: width * 0.94,
        height: height * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        top: 15,
    },
    register_form_background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex: -1,
        borderRadius: 50,
    },
    login_text: {
        fontSize: 28,
        color: Colors.blueA400,
        marginTop: 20,
    },
    register_button: {
        width: "60%",
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        backgroundColor: Colors.blueA400,
        borderRadius: 2,
    },
    register_button_text: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    register: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    register_left: {
        fontSize: 18,
        color: 'black',
    },
    register_right: {
        fontSize: 18,
        color: Colors.blueA400,
        marginLeft: 5,
    }
})