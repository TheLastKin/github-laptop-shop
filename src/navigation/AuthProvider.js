import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setDarkTheme] = useState(false);

    const storeDataToLocal = (user) => {
        try {
            AsyncStorage.setItem('userLoginState', JSON.stringify(user));
        } catch (e) {
            console.error(e);
        }
    }

    const CustomLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: Colors.white,
            text: Colors.grey900,
            darkBackground: Colors.grey100,
        }
    }

    const CustomDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: Colors.grey900,
            text: Colors.white,
            darkBackground: Colors.blueGrey900,
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomLightTheme;

    return (
        <PaperProvider theme={theme}>
            <AuthContext.Provider value={{
                user,
                setUser,
                storeDataToLocal,
                login: async (email, password) => {
                    await fetch('http://10.0.2.2:4000/api/loginUser/' + email + '/' + password)
                        .then(res => res.json())
                        .then(json => {
                            setUser(json);
                            storeDataToLocal(json);
                        })
                        .catch(e => console.error(e));
                },
                loginAsFacebook: async () => {
                    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
                    if (result.isCancelled) {
                        throw 'User cancelled the login process';
                    }
                    const data = await AccessToken.getCurrentAccessToken();
                    if (!data) {
                        throw 'Something went wrong obtaining access token';
                    }
                    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
                    await auth().signInWithCredential(facebookCredential);
                },
                loginAsGoogle: async () => {
                    GoogleSignin.configure({
                        webClientId: '606655215935-uhhp0ci5aa7oaktccorq5agot4bd07o6.apps.googleusercontent.com',
                    });
                    const { idToken } = await GoogleSignin.signIn();
                    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
                    await auth().signInWithCredential(googleCredential);
                },
                register: async (displayName, email, password) => {
                    let result = null;
                    await fetch('http://10.0.2.2:4000/api/registerUser/' + displayName + '/' + email + '/' + password)
                        .then(res => res.json())
                        .then(json => result = json)
                        .catch(e => console.error(e));
                    return result;
                },
                updateUserState: async (userId) => {
                    await fetch('http://10.0.2.2:4000/api/userInfo/' + userId)
                        .then(res => res.json())
                        .then(json => setUser(json))
                        .catch(e => console.error(e));
                },
                logout: async () => {
                    try {
                        await AsyncStorage.removeItem('userLoginState');
                    } catch (e) {
                        console.error(e);
                    }
                    if(auth().currentUser){
                        auth().signOut().then(() => console.log('User signed out'));
                    }else{
                        setUser(null);
                    }
                },
                toggleTheme: () => {
                    setDarkTheme(!isDarkTheme);
                },
            }}>
                {children}
            </AuthContext.Provider>
        </PaperProvider>
    )
};