/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors, useTheme } from 'react-native-paper';

const SettingScreen = ({ navigation }) => {
    const { toggleTheme } = useContext(AuthContext);
    const theme = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
            <TouchableOpacity style={styles.content_row} onPress={() => toggleTheme()}>
                <FontAwesome5 name={theme.dark?"sun":"moon"} color={Colors.blueA400} size={24} />
                <Text style={[styles.content_title, {color: theme.colors.text}]}>Chế độ {theme.dark?"sáng":"tối"}</Text>
            </TouchableOpacity>
        </View>
    );
};
export default SettingScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    content_row: {
        width: width*0.9,
        height: 35,
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 15,
    },
    content_title: {
        fontSize: 20,
        marginLeft: 10,
    },
});