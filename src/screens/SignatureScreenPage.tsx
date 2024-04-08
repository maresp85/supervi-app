import React, { useRef, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import SignatureScreen from 'react-native-signature-canvas';
import { Alert, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header as HeaderRNE, Icon } from '@rneui/themed';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import { postDigitalSignature } from '../api/adminApi';

interface Props extends StackScreenProps<any, any> {}

export const SignatureScreenPage = ({ navigation, route }: Props) => {

    const [isLoading, setIsLoading] = useState(false);
     
    const ref = useRef();

    const handleOK = (signature: any) => {
        sendDigitalSignature(signature);
    };

    const sendDigitalSignature = (signature: any) => {
        setIsLoading(true);
        let response = postDigitalSignature(
            route.params.ordenTrabajo,
            signature,
        );
        response.then((resp: any) => {
            setIsLoading(false);
            if (resp.data.ok == true) {
                Alert.alert(
                    'Firma digital enviada.',
                    '',
                    [     
                        {
                            text: 'OK', 
                            onPress: () => goBack()
                        }
                    ],
                        { cancelable: false },
                    );
            } 
        }).catch((err: any) => {      
            Alert.alert('Ocurrió un error, contacte al Administrador');
        });
    };   

    const goBack = () => {
        navigation.push('MyPages', { 
            screen: 'TipoTrabajoScreen', 
            params: {     
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
            },
        });
    }

    const imgHeight = 92;
    const style = `.m-signature-pad--footer
                .button {
                    background-color: colors.backgroundColor4;
                    color: #FFF;
                }
                body,html {
                    height: ${imgHeight}%;
                }`;

    return (
        <SafeAreaView style={ listStyle.container }>
            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'FIRMA DIGITAL DEL USUARIO', 
                    style: listStyle.header
                }}
                leftComponent={
                    <View style={ listStyle.headerButton }>  
                        {                            
                            <TouchableOpacity onPress={ goBack }>
                                <Icon 
                                    name='arrow-left'
                                    size={ 18 } 
                                    type='font-awesome' 
                                    color='white'
                                />
                            </TouchableOpacity>
                        }             
                    </View>
                }
            />     
            <SignatureScreen
                // handle when you click save button
                onOK={(img) => handleOK(img)}
                descriptionText='Firme en la parte superior' 
                clearText='Limpiar'
                confirmText='Enviar'
                webStyle={style}
                autoClear={true}
                imageType={'image/png'}
            />
        </SafeAreaView>
    )
};
