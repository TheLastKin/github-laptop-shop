import React, { useContext, useState } from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { Colors, Title, Avatar } from 'react-native-paper';
import ProcedureInput from '../custom_components/ProcedureInput';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import ComsModal from '../custom_components/ComsModal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ActionModal from '../custom_components/ActionModal';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

const UpdateInfoScreen = () => {
    const { user, updateUserState, storeDataToLocal } = useContext(AuthContext);
    const [displayName, setDisplayName] = useState(user.displayName);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [address, setAddress] = useState(user.address);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState({});
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [actionModalMessage, setActionModalMessage] = useState({});
    const [avatar, setAvatar] = useState({fileName: '', path: user.photoURL});
    const navigation = useNavigation();

    const reference = storage().ref('userPhoto');
    let photoDownloadURL = '';

    let isUpdating = false;
    let phoneRegex = "[0-9]{10,11}";

    const openImagePicker = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 300,
            cropping: true,
        }).then(image => {
            setAvatar({fileName: user._id + '.' + image.mime.substring(6), path: image.path});
        });
    }

    const uploadUserPhoto = async () => {
        if(avatar.path != user.photoURL){
            const task = reference.child(avatar.fileName).putFile(avatar.path);
            task.on('state_changed', taskSnapshot => {
                console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            });
            await task.then(async () => {
                photoDownloadURL = await reference.child(avatar.fileName).getDownloadURL();
            });
        }
    }

    const dismissModal = () => {
        setModalVisible(false);
    }

    const dismissActionModal = () => {
        setActionModalVisible(false);
    }

    const verifyUserInput = () => {
        let valid = true;
        if(displayName.length == 0 || phoneNumber.length == 0 || address.length == 0){
            setModalMessage({ message: "Hãy vui lòng nhập đầy đủ các mục!"});
            valid = false;
        }else if(displayName.length <= 5){
            setModalMessage({ message: "Tên hiển thị phải dài hơn 5 kí tự!"});
            valid = false;
        }else if(!phoneNumber.match(phoneRegex)){
            setModalMessage({ message: "Sai định dạng số điện thoại!"});
            valid = false;
        }else if(address.length <= 10){
            setModalMessage({ message: "Địa chỉ phải dài hơn 10 kí tự!"});
            valid = false;
        }
        setModalVisible(true);
        return valid;
    }

    const updateUserInfo = () => {
        if(isUpdating || !verifyUserInput()) return;
        
        isUpdating = true;
        uploadUserPhoto().then(async () => {
            if(photoDownloadURL.length == 0){
                photoDownloadURL = user.photoURL;
            }
            let result = null;
            await fetch('http://10.0.2.2:4000/api/updateUser/'
                + user._id + '/' + displayName + '/' + phoneNumber + '/' + address + '/' + encodeURIComponent(photoDownloadURL))
                .then(res => res.json())
                .then(json => result = json)
                .catch(e => console.error(e))
            if (result) {
                setModalMessage({ message: "Cập nhật thành công!", iconName: "check-circle" });
                await updateUserState(user._id);
                await storeDataToLocal(user);
            } else {
                setModalMessage({ message: "Cập nhật thất bại!", iconName: "x-octagon" })
            }
            setModalVisible(true);
            isUpdating = false;
        });
    }

    return(
        <View style={styles.container}>
            <Entypo 
                style={styles.back} 
                name="chevron-thin-left" 
                size={30} 
                color={Colors.blueA400}
                onPress={() => navigation.navigate("Profile")}
            />
            <View style={styles.avatar_container}>
                <Image style={styles.avatar} source={{uri: avatar.path}} />
                <MaterialCommunityIcons 
                    style={[styles.avatar_edit, {display: auth().currentUser?'none':'flex'}]} 
                    name="square-edit-outline" 
                    size={24} 
                    color={Colors.grey600} 
                    onPress={() => openImagePicker()}
                />
                <TouchableOpacity 
                    style={[styles.cancel_change, {display: avatar.path!=user.photoURL?'flex':'none'}]} 
                    onPress={() => setAvatar({fileName: '', path: user.photoURL})
                }>
                    <Text style={styles.cancel_change_text}>Hủy sửa đổi</Text>
                </TouchableOpacity>
            </View>
            <Title style={styles.display_name}>{user.displayName}</Title>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.form_input}>
                <ProcedureInput
                    textColor={Colors.grey800}
                    borderColor={Colors.grey900}
                    iconName="user"
                    onChangeText={(text) => setDisplayName(text)}
                    placeholder="Tên hiển thị..."
                    defaultValue={user.displayName}
                />
                <ProcedureInput
                    textColor={Colors.grey800}
                    borderColor={Colors.grey900}
                    iconName="location-arrow"
                    onChangeText={(text) => setAddress(text)}
                    placeholder="Địa chỉ của bạn..."
                    defaultValue={user.address}
                />
                <ProcedureInput
                    textColor={Colors.grey800}
                    borderColor={Colors.grey900}
                    iconName="phone"
                    onChangeText={(text) => setPhoneNumber(text)}
                    placeholder="Số điện thoại của bạn..."
                    defaultValue={user.phoneNumber}
                    keyboardType="numeric"
                />
                <TouchableOpacity style={styles.update_button} onPress={() => updateUserInfo()}>
                    <Text style={styles.update_text}>Cập Nhật</Text>
                </TouchableOpacity>
            </View>
            <ComsModal 
                visible={modalVisible} 
                dismiss={dismissModal} 
                message={modalMessage.message} 
                iconName={modalMessage.iconName}
            />
            <ActionModal
                visible={actionModalVisible}
                dismiss={dismissActionModal}
                message={actionModalMessage.message}

            />
        </View>
    );
};

export default UpdateInfoScreen;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Colors.white,
    },
    avatar_container:{
        alignSelf: 'center',
        marginTop: 20,
    },
    avatar:{
        width: 100,
        height: 100,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: Colors.blueA400,
    },
    avatar_edit: {
        padding: 3,
        position: 'absolute',
        bottom: -5,
        right: 2,
        backgroundColor: Colors.grey200,
        borderRadius: 50,
    },
    display_name:{
        alignSelf: 'center',
        marginTop: 10,
    },
    email:{
        alignSelf: 'center',
        marginTop: 5,
        fontSize: 14,
    },
    form_input:{
        width: width,
        alignItems: 'center'
    },
    update_button:{
        marginTop: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: "60%",
        height: 50,
        backgroundColor: Colors.blueA400,
        borderRadius: 10,
        shadowColor: '#ccc',
        shadowOpacity: 0.6,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 10,
    },
    update_text:{
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
    back:{
        position: 'absolute',
        top: 10,
        left: 10,
    },
    cancel_change: {
        padding: 8,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.red400,
    },
    cancel_change_text:{
        color: Colors.white,
        fontSize: 18,
    }
});