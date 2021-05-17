import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Provider as PaperProvider, DefaultTheme, DarkTheme } from 'react-native-paper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isDarkTheme, setDarkTheme] = useState(false);

    const storeDataToLocal = async (user) => {
        try {
            await AsyncStorage.setItem('userLoginState', JSON.stringify(user));
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
        }
    }

    const CustomDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: Colors.grey900,
            text: Colors.white,
            darkBackground: Colors.blueGrey900
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomLightTheme;

    return (
        <PaperProvider theme={theme}>
            <AuthContext.Provider value={{
                user,
                setUser,
                login: async (email, password) => {
                    await fetch('http://10.0.2.2:4000/api/loginUser/' + email + '/' + password)
                        .then(res => res.json())
                        .then(json => {
                            setUser(json);
                            storeDataToLocal(json);
                        })
                        .catch(e => console.error(e));
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
                    setUser(null);
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