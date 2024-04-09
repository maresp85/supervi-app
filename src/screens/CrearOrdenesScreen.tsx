import React, { useContext, useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

import { 
    getTrabajo,
    getObraUsuario,
    postOrden,
    postHermeticidad,
} from '../api/adminApi';

import { Button, Header as HeaderRNE } from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    SafeAreaView,
    TextInput,
    ToastAndroid,
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const CrearOrdenesScreen = ({ navigation }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);    
    const [information, setInformation] = useState([]);
    const [informationObra, setInformationObra] = useState([]);
    const [trabajoSelected, setTrabajoSelected] = useState('');
    const [obraSelected, setObraSelected] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [refreshing, setRefreshing] = useState(false);
        
    useEffect(() => {
        getInitialData();    
    }, []);  


    const getInitialData = () => {
        getTrabajoApi();
        getObraApi();
    }

    const getTrabajoApi = () => {
        setIsLoading(true);
        let response = getTrabajo(user?.empresa[0]);    
        response.then((resp: any) => {
            setInformation(resp.data.trabajoDB);
            setIsLoading(false);
            setRefreshing(false);
        }).catch((err: any) => {  
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const getObraApi = () => {
        setIsLoading(true);
        let response = getObraUsuario(user?._id);
        response.then((resp: any) => {           
            setInformationObra(resp.data.obraDB);
            setIsLoading(false);
            setRefreshing(false);
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const enviarOrden = () => {       
        if (trabajoSelected == null || trabajoSelected == '') {
            ToastAndroid.show('Seleccione un trabajo', ToastAndroid.LONG);
            return;
        }

        if (obraSelected == null || obraSelected == '') {
            ToastAndroid.show('Seleccione un aliado', ToastAndroid.LONG);
            return;
        }

        setIsLoading(true);
        let response = postOrden(
            user?.empresa,
            trabajoSelected,
            obraSelected,
            user?._id,
            observaciones
        );
        response.then((resp: any) => {
            setIsLoading(false);
            if (resp.data.ok == true) {
                setObservaciones('');
                setTrabajoSelected('');
                setObraSelected('');
                showFlashMessage(
                    'success',                    
                    'Orden de trabajo generada correctamente.',
                    '',
                    3500
                );
                goHome(); 
            }              
        }).catch((err: any) => {
            setIsLoading(false);
            Alert.alert(err.response.data.err.errmsg);   
        });
    }

    const goHome = () => {
        navigation.push('MyTabs', { 
            screen: 'OrdenesScreen',
        });
    }

    const showFlashMessage = (type: any, msg: string, desc: string, duration: number) => {
        setIsLoading(false);
        setRefreshing(false); 
        showMessage({
            message: msg,
            description: desc,
            duration: duration,
            floating: true,
            type: type,
        });
    }

    const renderTrabajo = () => {
        return information.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />;
        });
    };

    const renderObra = () => {
        return informationObra.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />;
        });
    };

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        setRefreshing(false);   
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'GENERAR ORDEN DE TRABAJO', 
                    style: listStyle.header
                }}
            />

            { !isLoading ? 
                (
                <View>
                    <Picker
                        selectedValue={ trabajoSelected }
                        style={{ height: 20, width: 370 }}
                        onValueChange={(itemValue, itemIndex) =>
                            setTrabajoSelected(itemValue)
                        }
                    >
                        <Picker.Item label='Seleccione un tipo de trabajo' value='' />
                        { renderTrabajo() }
                    </Picker>
                    <Picker
                        selectedValue={ obraSelected }
                        style={{ height: 20, width: 370 }}
                        onValueChange={(itemValue, itemIndex) =>
                            setObraSelected(itemValue)
                        }
                    >
                        <Picker.Item label='Seleccione un aliado' value='' />
                        { renderObra() }
                    </Picker>
                    <View style={{ padding: 4 }}>
                        <TextInput 
                            style={ listStyle.textInput3 } 
                            underlineColorAndroid='rgba(0,0,0,0)' 
                            placeholder='Observaciones'
                            onChangeText={(observaciones) => setObservaciones(observaciones)}
                            value={observaciones} 
                            placeholderTextColor='#4b4b56'
                        />   
                    </View>

                    <View style={{ marginTop: 2, padding: 4 } }>
                        <Button 
                            buttonStyle={{ backgroundColor: colors.backgroundColor4 }}                            
                            title='GENERAR ORDEN DE TRABAJO'
                            onPress={ enviarOrden } 
                        />
                    </View>           
                </View>
                ) : (
                    <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
                )
            }            
    </SafeAreaView>
    );
}
