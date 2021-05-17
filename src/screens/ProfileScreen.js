import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Title, Caption, Colors, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../navigation/AuthProvider';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
    const { user, logout } = useContext(AuthContext);
    const navigation = useNavigation();
    const theme = useTheme();

    const makeTag = () => {
        return "@" + user.email.substring(0, user.email.indexOf("@"));
    }

    return (
        <View style={[styles.container, {backgroundColor: theme.colors.darkBackground}]}>
            <View style={styles.topHead}>
                <View style={styles.avatar_container}>
                    <Image style={styles.avatar} source={{ uri: 'http://10.0.2.2:4000/images/' + user.profilePicture }} />
                    <MaterialCommunityIcons style={styles.avatar_edit} name="square-edit-outline" size={20} color={Colors.grey600}/>
                </View>
                <View style={styles.usertitles_section}>
                    <Title>{user.displayName}</Title>
                    <Caption style={{ fontSize: 14 }}>{makeTag()}</Caption>
                </View>
            </View>
            <View style={styles.userinfo_section}>
                <View style={styles.info_row}>
                    <Entypo name="location" size={20} color="#777777" />
                    <Text style={{ marginLeft: 8, color: theme.colors.text }}>{user.address}</Text>
                </View>
                <View style={styles.info_row}>
                    <MaterialCommunityIcons name="phone" size={20} color="#777777" />
                    <Text style={{ marginLeft: 8, color: theme.colors.text }}>{user.phoneNumber}</Text>
                </View>
                <View style={styles.info_row}>
                    <MaterialCommunityIcons name="email" size={20} color="#777777" />
                    <Text style={{ marginLeft: 8, color: theme.colors.text }}>{user.email}</Text>
                </View>
            </View>
            <View style={styles.bonus_banner}>
                <View style={styles.left_banner}>
                    <Title>{user.favorPoint}</Title>
                    <Caption>Điểm thưởng</Caption>
                </View>
                <View style={styles.right_banner}>
                    <Title>{user.reputationPoint}</Title>
                    <Caption>Độ uy tín</Caption>
                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.content_row}>
                    <MaterialIcons name="person" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]} onPress={() => navigation.navigate("UpdateInfo")}>Cập nhật thông tin cá nhân</Text>
                </View>
                <View style={styles.content_row}>
                    <MaterialIcons name="favorite" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]} onPress={() => navigation.navigate("FavoriteProducts")}>Sản phẩm yêu thích</Text>
                </View>
                <View style={styles.content_row}>
                    <MaterialCommunityIcons name="credit-card" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]}>Tình trạng đơn hàng</Text>
                </View>
                <View style={styles.content_row}>
                    <MaterialIcons name="rate-review" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]}>Bài đánh giá gần đây</Text>
                </View>
                <View style={styles.content_row}>
                    <MaterialCommunityIcons name="share-outline" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]}>Chia sẻ ứng dụng</Text>
                </View>
                <View style={styles.content_row}>
                    <MaterialIcons name="contact-support" color={Colors.blueA400} size={24} />
                    <Text style={[styles.content_title, {color: theme.colors.text}]}>Hỗ trợ người dùng</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button_logout} onPress={() => logout()}>
                <Text style={styles.text_logout}>Đăng Xuất</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: width,
        height: height,
    },
    topHead: {
        position: 'relative',
        width: width,
        height: 81,
        marginTop: 15,
        flexDirection: 'row',
    },
    topHeadBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    topHeadContent: {
        position: 'absolute',
        bottom: 15,
        width: width,
        height: 'auto',
        flexDirection: 'row',
    },
    avatar_container:{
        left: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderRadius: 50,
        borderColor: Colors.blueA400,
    },
    avatar_edit:{
        padding: 3,
        position: 'absolute',
        bottom: -5,
        right: 2,
        backgroundColor: Colors.grey200,
        borderRadius: 50,
    },
    usertitles_section: {
        position: 'relative',
        width: 'auto',
        height: 'auto',
        flexDirection: 'column',
        marginLeft: 25,
    },
    userinfo_section: {
        position: 'relative',
        width: width,
        height: 'auto',
        flexDirection: 'column',
        marginTop: 10,
    },
    info_row: {
        position: 'relative',
        flexDirection: 'row',
        marginTop: 8,
        marginLeft: 20,
    },
    bonus_banner: {
        position: 'relative',
        flexDirection: 'row',
        width: width,
        height: 75,
        marginTop: 20,
    },
    left_banner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#777777'
    },
    right_banner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#777777',
    },
    content: {
        position: 'relative',
        width: width,
        height: 'auto',
        flexDirection: 'column',
    },
    content_row: {
        position: 'relative',
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20,
    },
    content_title: {
        color: '#3D3D3D',
        fontSize: 18,
        marginLeft: 8,
    },
    button_logout: {
        marginTop: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        width: width * 0.75,
        height: 50,
        backgroundColor: Colors.blueA400,
        borderRadius: 10,
    },
    text_logout: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    }
});