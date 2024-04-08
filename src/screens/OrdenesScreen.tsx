import React, { useContext, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import NetInfo from '@react-native-community/netinfo';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

import { getOrder, updateExtraFields } from '../api/adminApi';

import { 
    Badge, 
    Button,
    Icon,
    Overlay, 
    Header as HeaderRNE,
} from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,    
    RefreshControl, 
    SafeAreaView, 
    Text, 
    TextInput,   
    TouchableOpacity,
    ToastAndroid,
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const OrdenesScreen = ({ navigation }: Props) => {

    Moment.locale('es');
    const { user, logOut } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);    
    const [visible, setVisible] = useState(false);
    const [information, setInformation] = useState([]); 
    const [textInputs, setTextInputs] = useState([]);
    const [textInputsCopy, setTextInputsCopy] = useState([]);
    const [extraFields, setExtraFields] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isInternetReachable, setIsInternetReachable] = useState(true);
    const [ordenTrabajo, setOrdenTrabajo] = useState({});
        
    useEffect(() => {        
        checkInternetConection();
        permissionsMediaLibrary();
        getInitialData();    
    }, []);  

    const verifyPermissionsMediaLibrary = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();

        if (status !== 'granted') {
          Alert.alert(
            'Permisos insuficientes!',
            'Necesita otorgar permisos para usar la libreria de imágenes.',
            [{ text: 'Ok' }]
          );
          return false;
        }
        return true;
    };

    const permissionsMediaLibrary = async () => {
        const hasPermission = await verifyPermissionsMediaLibrary();
        if (!hasPermission) {
            return;
        }
    }  

    const checkInternetConection = () => {
        const unsubscribe = NetInfo.addEventListener(state => {                 
            if (state.isInternetReachable) {                
                setIsInternetReachable(true);
            } else {
                setIsInternetReachable(false);                 
            }
        });
    }

    const getInitialData = () => {
        getOrders();
    }

    const getOrders = () => {
        setIsLoading(true);
        let response = getOrder(user?._id, false);    
        response.then((resp: any) => {           
            setInformation(resp.data.ordentrabajoDB);
            let count = Object.keys(resp.data.ordentrabajoDB).length;
            if (count == 0) {
                ToastAndroid.show('No hay ordenes de trabajo.', ToastAndroid.LONG);  
            }  
            setIsLoading(false);
            setRefreshing(false);
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const goTo = (ordenTrabajo: any) => {
        setOrdenTrabajo(ordenTrabajo);

        if (ordenTrabajo.bitacora) {
            goToTipoTrabajo(ordenTrabajo._id, ordenTrabajo.id);
            return;            
        }
                
        if (ordenTrabajo.extraFields.length > 0 && ordenTrabajo.extraFieldsData.length === 0) {
            setTextInputs(ordenTrabajo.extraFields);
            setTextInputsCopy(ordenTrabajo.extraFields);
            toggleOverlay();
        } else {
            goToTipoTrabajo(ordenTrabajo._id, ordenTrabajo.id);
        }
    }

    const goToTipoTrabajo = (_id: any, id: any) => {
        navigation.push('MyPages', { 
            screen: 'TipoTrabajoScreen', 
            params: { 
                'ordenTrabajo': _id,
                'ordenTrabajoId': id,
            },
        });
    }

    const checkEmptyTextInputs  = async () => {
        let emptyFieldFound = false;
        await Promise.all(textInputs.map(async (value, index) => {
          if (value === "" || textInputsCopy[index] === value) {
            emptyFieldFound = true;         
            showAlertError(`El campo en la posición ${textInputsCopy[index]} es obligatorio.`);
          }
        }));
        if (emptyFieldFound) {
          return true;
        } else {
          return false;
        }
    }; 

    const sendExtraFields = async () => {
        toggleOverlay();
        if (await checkEmptyTextInputs()) {
            return;
        }

        setIsLoading(true);
        let response = updateExtraFields(ordenTrabajo._id, textInputs);
        response.then((resp: any) => {
            setIsLoading(true);
            Alert.alert(
                'Datos enviados correctamente',
                '',
                [     
                    {
                        text: 'OK', 
                        onPress: () => goToTipoTrabajo(ordenTrabajo._id, ordenTrabajo.id)
                    }
                ],
                    { cancelable: false },
                );            
        }).catch((err: any) => {
            setIsLoading(false);
            Alert.alert('Ocurrió un error, contacte al Administrador');
        });
    };   

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const handleInputChange = (text: any, index: any) => {
        const newInputs: any = [...textInputs];
        newInputs[index] = text;
        setTextInputs(newInputs);
    };

    const handleInputFocus = (index: any) => {
        const newInputs: any = [...textInputs];
        newInputs[index] = '';
        setTextInputs(newInputs);
    };    

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        setRefreshing(false);   
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    const onRefresh = React.useCallback(() => {         
        setRefreshing(true);
        getOrders();
    }, []);  
    
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'ORDENES DE TRABAJO', 
                    style: listStyle.header
                }}
            />

            <Overlay isVisible={ visible } onBackdropPress={ toggleOverlay }>
                <View>
                    <Text style={ listStyle.title }>DIGITE LOS SIGUIENTES CAMPOS</Text>
                    <View style={{marginTop: 8}}>            
                        {textInputs.map((value, index) => (
                            <View>
                                <Text style={ listStyle.title }>{textInputsCopy[index]}</Text>
                                <TextInput
                                    key={index.toString()}
                                    placeholder={value}
                                    onChangeText={(text) => handleInputChange(text, index)}
                                    onFocus={() => handleInputFocus(index)}
                                    style={ listStyle.textInput }
                                    value={value}
                                    editable={true}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={{ marginTop: 8 } }>
                        <Button 
                            title='Enviar'
                            buttonStyle={{ backgroundColor: colors.backgroundColor4 }}
                            onPress={ sendExtraFields } 
                        />
                    </View>
                </View>
            </Overlay>        

            {!isLoading ? 
            (
                <FlatList
                    data={ information }    
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }          
                    renderItem={ ({ item }) =>
                    <TouchableOpacity 
                        onPress={ ()=>{ goTo(item) } 
                        }
                    >                        
                        <View style={ listStyle.item }>

                            <View style={ listStyle.containerText }>
                                <View style={{ width: '70%' }}>                                    
                                    <Text style={ listStyle.title }>
                                        { item.trabajo.nombre }
                                    </Text>   
                                </View>
                                <View style={{ width: '30%' }}>                                
                                    <View style={{ paddingTop: 3 }}>
                                        { item.estado == 'ASIGNADA' ? 
                                            <Badge style={{ padding: 14 }} value={ item.estado } status='primary' />
                                            : null 
                                        }
                                        { 
                                            (item.estado == 'CUMPLE' && !item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 20 }} value={ item.estado } status='success' />
                                            : 
                                            null 
                                        }
                                        { 
                                            (item.estado == 'CUMPLE' && item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 20 }} value='CERRADA' status='success' />
                                            : 
                                            null 
                                        } 
                                        { 
                                            (item.estado == 'NO CUMPLE' && !item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 10 }} value={ item.estado } status='error' />
                                            : 
                                            null 
                                        }
                                        { 
                                            (item.estado == 'NO CUMPLE' && item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 10 }} value='ABIERTA' status='error' />
                                            : 
                                            null 
                                        }   
                                        { item.estado == 'EN PROCESO' ? 
                                            <Badge style={{ padding: 10 }} value={ item.estado } status='warning' />
                                            : null 
                                        }                                                   
                                    </View> 
                                </View>
                            </View>
                            <View style={ listStyle.containerText }>
                                <View style={{ width: '5%' }}>
                                    <Icon
                                        style={{ paddingTop: 3 }}
                                        name='key'
                                        size={12} 
                                        type='font-awesome'
                                        color='#74747d'
                                    />
                                </View>
                                <View style={{ width: '95%', paddingLeft: 5 }}>
                                    <Text style={ listStyle.text }>
                                        { item.id }
                                    </Text>  
                                </View>
                            </View>   
                            <View style={ listStyle.containerText }>
                                <View style={{ width: '5%' }}>
                                    <Icon
                                        style={{ paddingTop: 3 }}
                                        name='map-marker'
                                        size={12} 
                                        type='font-awesome'
                                        color='#74747d'
                                    />
                                </View>
                                <View style={{ width: '95%', paddingLeft: 5 }}>
                                    <Text style={ listStyle.text }>
                                        { item.obra.nombre }
                                    </Text>  
                                </View>
                            </View>                                                       
                            <View style={ listStyle.containerText }>
                                <View style={{ width: '5%' }}>
                                    <Icon
                                        style={{ paddingTop: 3 }}
                                        name='calendar'
                                        size={12} 
                                        type='font-awesome'
                                        color='#74747d'
                                    />
                                </View>
                                <View style={{ width: '95%', paddingLeft: 5 }}>
                                    <Text style={ listStyle.text }>
                                        { Moment(item.fecha).format('LLL') }
                                    </Text>  
                                </View>
                            </View>

                        </View>
                    </TouchableOpacity> }
                    keyExtractor={item => item._id}
                />                           
            ) : (
                <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
            )}                     
        </SafeAreaView>  
    );
}
