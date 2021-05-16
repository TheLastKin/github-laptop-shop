import React, { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import MainContainer from './MainContainer';
import AuthContainer from './AuthContainer';
const Route = () => {
    const {user} = useContext(AuthContext);
    return(
        <NavigationContainer>
            { user ? <MainContainer/>:<AuthContainer/>}
        </NavigationContainer>
    );
};

export default Route;