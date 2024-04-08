import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { Header as HeaderRNE } from '@rneui/themed';
import { 
    ActivityIndicator,
    Alert, 
    KeyboardAvoidingView, 
    Keyboard, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    View 
} from 'react-native';

import settings from '../theme/settings';
import { useForm } from '../hooks/useForm';
import colors from '../theme/colors';
import { loginStyle } from '../theme/loginTheme';

interface Props extends StackScreenProps<any, any> {}

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError, status, logOut } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false); 
    const { email, password, onChange } = useForm({
        email: '',
        password: ''
    });

    useEffect(() => {
        tryLogin();

        if (status) setIsLoading(false);
        if (errorMessage.length === 0) return;
        
        logOut();
        
        Alert.alert(
            'No puede ingresar', 
            errorMessage,
            [
                {
                    text: 'Ok',
                    onPress: removeError
                }   
            ]     
        );        

    }, [errorMessage, status]);

    const tryLogin = async () => {

        setIsLoading(true);
        const userData = await AsyncStorage.getItem('userData');
        
        if (userData) {
          const transformedData = JSON.parse(userData);
          const { email, password } = transformedData;
            
          setIsLoading(true);
            try {
                
                signIn({ username: email, password }); 
                
            } catch (error: any) {
            
                setIsLoading(false);
                Alert.alert(
                    'No puede ingresar', 
                    error,
                    [
                        {
                            text: 'Ok',
                        }   
                    ]     
                );
            }
        }                            
    };
   
    const onLogin = () => {        
        Keyboard.dismiss();
        if (email == '' || password == '') {

            Alert.alert(
                'No puede ingresar', 
                'Digite todos los datos',
                [
                    {
                        text: 'Ok',
                    }   
                ]     
            );

        } else {

            setIsLoading(true);
            try {
                
                signIn({ username: email, password }); 
                 
            } catch (error: any) {                
                setIsLoading(false);
                Alert.alert(
                    'No puede ingresar', 
                    error,
                    [
                        {
                            text: 'Ok',
                        }   
                    ]     
                );
            }        
                          
        }
    }

    return (
        <>
            <HeaderRNE
                backgroundColor={ colors.backgroundColor }              
            />
            
            <Background />

            <KeyboardAvoidingView  style={{ flex: 1 }}>

                <View style={ loginStyle.formContainer }>
                   
                    <WhiteLogo />

                    <View>
                        <Text style={ loginStyle.labelLogin }>CORREO ELECTRÓNICO</Text>
                        <TextInput 
                            autoCapitalize='none'
                            autoCorrect={ false }
                            onSubmitEditing={ onLogin }
                            onChangeText={ (value) => onChange(value, 'email') }
                            placeholder=''
                            placeholderTextColor={'rgba(255, 255, 255, 0.4)'}
                            style={ loginStyle.inputFieldLogin }
                            selectionColor='black'
                            value={ email }
                        />

                        <Text style={ loginStyle.labelLogin }>CONTRASEÑA</Text>
                        <TextInput 
                            autoCorrect={ false }
                            autoCapitalize='none'
                            onChangeText={ (value) => onChange(value, 'password') }
                            onSubmitEditing={ onLogin }
                            placeholder=''
                            placeholderTextColor={'rgba(255, 255, 255, 0.4)'}
                            style={ loginStyle.inputFieldLogin }
                            selectionColor='black'
                            secureTextEntry={true}
                            value={ password }
                        />
                    </View>  

                    {isLoading ? 
                        (
                            <ActivityIndicator style={{ marginTop: 52 }} size="large" color='white'/>             
                        ) : (                  

                            <View style={ loginStyle.buttonContainer }>
                                <TouchableOpacity
                                    activeOpacity={ 0.8 }
                                    style={ loginStyle.buttonLogin }
                                    onPress={ onLogin }
                                >
                                    <Text style={ loginStyle.buttonTextLogin }>Ingresar</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }                    

                    <View style={ loginStyle.newUserContainer }>                   
                        <Text style={{ fontSize: 12, color: 'black' }}>v { settings.app_version }</Text>    
                        {settings.environment != 'PROD'
                        ?                 
                        <Text style={{ fontSize: 12, color: 'black' }}>{ settings.environment }</Text>             
                        :
                        null
                        }
                    </View> 
                   
                </View>

            </KeyboardAvoidingView>
        </>
    );
}