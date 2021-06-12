import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import MainContainer from './MainContainer';
import AuthContainer from './AuthContainer';
import auth from '@react-native-firebase/auth';
import { GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk-next';

const Route = () => {
    const {user, setUser} = useContext(AuthContext);
    const getFBProfilePicture = async (user) => {
        const infoRequest = new GraphRequest(
            '/me',
            {
                parameters: {
                    fields: {
                        string: 'email,name,picture'
                    },
                    access_token: {
                        string: (await AccessToken.getCurrentAccessToken()).accessToken.toString()
                    }
                }
            },
            (error, result) => {
                if (error) {
                    console.log('Error fetching data: ' + error.toString());
                } else {
                    setUser({ ...user._user, photoURL: result.picture.data.url });
                }
            },
        );
        new GraphRequestManager().addRequest(infoRequest).start();
    }
    const onAuthStateChanged = (user) => {
        setUser(user);
        if (auth().currentUser?.providerData[0].providerId === 'facebook.com'){
            console.log('Getting FB profile picture...');
            getFBProfilePicture(user);
        }
    }
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        //unsubcribe listener to avoid listening to any change
        return subscriber;
    }, []);
    return(
        <NavigationContainer>
            { user ? <MainContainer/>:<AuthContainer/>}
        </NavigationContainer>
    );
};

export default Route;