import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { Colors } from 'react-native-paper';
import ReactNativeModal from 'react-native-modal';

const ActionModal = ({ message, visible, dismiss, onConfirm }) => {
    return (
        <ReactNativeModal
            isVisible={visible}
            animationIn="fadeInUp"
            animationInTiming={500}
            animationOut="fadeOutDown"
            backdropColor="#777777"
            onBackdropPress={dismiss}>
            <View style={styles.modal_container}>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.actions}>
                    <Text style={styles.action_text} onPress={async () => {
                        await onConfirm();
                        dismiss();
                    }}>Xác nhận</Text>
                    <Text style={styles.action_text} onPress={dismiss}>Hủy</Text>
                </View>
            </View>
        </ReactNativeModal>
    );
};

export default ActionModal;

const styles = StyleSheet.create({
    modal_container: {
        backgroundColor: Colors.white,
        borderRadius: 3,
        paddingTop: 15,
        paddingHorizontal: 20,
        paddingBottom: 60,
    },
    message: {
        fontSize: 20,
        color: Colors.blueA400,
    },
    actions:{
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
    },
    action_text:{
        fontSize: 18,
        color: Colors.blueA400,
        marginHorizontal: 10,
        fontWeight: 'bold',
    },
});