import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Keyboard, TextInput } from 'react-native';
import { Colors } from 'react-native-paper';
import ComsModal from '../custom_components/ComsModal';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProcedureInput from '../custom_components/ProcedureInput';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [showFooter, setShowFooter] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const navigation = useNavigation();

    const dismissModal = () => {
        setModalVisible(false);
    }

    const renderFooter = () => {
        if (showFooter) {
            return (
                <View style={styles.recover}>
                    <Text style={styles.recover_left}>Mật khẩu đã được đặt lại?</Text>
                    <TouchableOpacity>
                        <Text
                            style={styles.recover_right}
                            onPress={() => navigation.navigate("Login")}>
                            Đăng nhập thôi.
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return null;
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const verifyUserInput = () => {
        if (email.length == 0) {
            setModalMessage({ message: "Hãy điền email của bạn!", iconName: "alert-circle" });
        }else if(!validateEmail(email)){
            setModalMessage({ message: "Email không hợp lệ!", iconName: "x-octagon" });
        } else {
            setModalMessage({ message: "Đã gửi yêu cầu đặt lại mật khẩu! Hãy kiểm tra email của bạn.", iconName: "x-octagon" });
        }
        setModalVisible(true);
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
            <View style={styles.message}>
                <Text style={styles.message_text}>Bạn quên mất mật khẩu ư? Đừng lo, chúng tôi sẽ giúp bạn lấy lại.</Text>
            </View>
            <View style={styles.recover_form}>
                <ProcedureInput
                    textColor={Colors.grey800}
                    borderColor={Colors.grey900}
                    iconName="envelope"
                    onChangeText={(text) => setEmail(text)}
                    placeholder="Email của bạn..."
                    placeholderTextColor={Colors.grey800}
                />
                <TouchableOpacity style={styles.recover_button} onPress={() => verifyUserInput()}>
                    <Text style={styles.recover_button_text}>Gửi yêu cầu</Text>
                </TouchableOpacity>
            </View>
            {renderFooter()}
            <ComsModal visible={modalVisible} dismiss={dismissModal} message={modalMessage.message} iconName={modalMessage.iconName} />
        </View>
    );
};

export default ForgotPasswordScreen;

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
        bottom: 20,
    },
    brand_left: {
        fontSize: 34,
        color: Colors.blue400,
    },
    message:{
        position: 'relative',
        paddingHorizontal: 15,
        marginTop: 25,
    },
    message_text:{
        fontSize: 18,
        color: Colors.black,
        textAlign: 'center',
    },
    brand_right: {
        fontSize: 34,
        color: 'black',
    },
    recover_form: {
        width: width * 0.95,
        height: height * 0.5,
        alignItems: 'center',
        paddingTop: 70,
        position: 'relative',
    },
    recover_button: {
        width: "60%",
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        backgroundColor: Colors.blueA400,
        borderRadius: 2,
    },
    recover_button_text: {
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },
    recover: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    recover_left: {
        fontSize: 18,
        color: 'black',
    },
    recover_right: {
        fontSize: 18,
        color: Colors.blueA400,
        marginLeft: 5,
    },
})