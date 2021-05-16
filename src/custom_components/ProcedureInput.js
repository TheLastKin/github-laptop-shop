import React from 'react';
import { StyleSheet, Dimensions, TextInput, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from 'react-native-paper';

const ProcedureInput = ({textColor, placeholderTextColor, iconName = "alert-circle", secureTextEntry = false, placeholder, onChangeText, borderColor, ...rest}) => {
    return (
        <View style={[styles.container, {borderBottomColor: borderColor}]}>
            <FontAwesome name={iconName} size={20} color={textColor}/>
            <TextInput
                style={[styles.text_input, {color: textColor}]}
                placeholder={placeholder}
                secureTextEntry = {secureTextEntry}
                onChangeText={onChangeText}
                placeholderTextColor={placeholderTextColor}
                {...rest}
            />
        </View>
    );
};

export default ProcedureInput;

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
    container:{
        width: width*0.75,
        height: 'auto',
        borderBottomWidth: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 30,
        alignItems: 'center'
    },
    text_input:{
        marginLeft: 10,
        fontSize: 20,
    }
});