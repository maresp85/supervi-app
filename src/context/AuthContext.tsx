import React, { createContext, useEffect, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Usuario, LoginData } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';
import settings from '../theme/settings';

import * as Notifications from 'expo-notifications';

type AuthContextProps = {
    errorMessage: string;
    route: string | null;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: () => void;
    signIn: (loginData: LoginData) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    route: null,
    token: null,
    user: null,
    errorMessage: '',
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, authInitialState);    
    const notificationListener: any = useRef();

    useEffect(() => {
        checkToken();
        notifications();
    }, []);

    const notifications = () => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            if (notification.request.content.data.close_session) logOut();
        }); 
    }

    const checkToken = async() => {
        return dispatch({ type: 'notAuthenticated' });
    }
    
    const signIn = async({ username, password }: LoginData) => {        
        
        let details = {
            'email': username,
            'password': password
        };

        let formBody: any = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        return await fetch(`${settings.baseURL}/login`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer token',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }).then((response) => response.json())
            .then(async (responseJson: any) => {
            if (responseJson.token) {
                dispatch({
                    type: 'signUp',
                    payload: {
                        token: responseJson.token,
                        user: responseJson.usuarioDB,
                        route: '1',
                    }
                });
                
                await AsyncStorage.setItem('token', responseJson.token);
                await AsyncStorage.setItem(
                    'userData',
                    JSON.stringify({
                        email: username,                      
                        password: password,
                    })
                  );
            } else {
                dispatch({
                    type: 'addError',
                    payload: responseJson.err.message,
                });
            }            
        }).catch((error) => {
            dispatch({
                type: 'addError',
                payload: error.message || 'Información incorrecta.'
            });
        });
    };

    const signUp = () => {};

    const logOut = async() => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userData');
        dispatch({ type: 'logout' });
    };

    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signIn,
            signUp,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    );
}