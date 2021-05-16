import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { Colors } from 'react-native-paper';
import ReactNativeModal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

const ComsModal = ({ message, iconName = "alert-circle", visible, dismiss }) => {
    return (
        <ReactNativeModal
            isVisible={visible}
            animationIn="fadeInUp"
            animationInTiming={500}
            animationOut="fadeOutDown"
            backdropColor="#777777"
            onBackdropPress={dismiss}>
            <View style={styles.modal_container}>
                <Feather name={iconName} size={50} color={Colors.blueA400}/>
                <Text style={styles.message}>{message}</Text>
            </View>
        </ReactNativeModal>
    );
};

export default ComsModal;

const styles = StyleSheet.create({
    modal_container: {
        backgroundColor: Colors.white,
        borderRadius: 3,
        paddingHorizontal: 18,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    message: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.blueA400,
        textAlign: 'center',
    },
});