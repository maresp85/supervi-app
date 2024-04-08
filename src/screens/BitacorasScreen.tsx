import React, { useContext, useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import NetInfo from '@react-native-community/netinfo';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

import { getOrder } from '../api/adminApi';

import { 
    Badge,
    Icon,
    Header as HeaderRNE,
} from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,    
    RefreshControl, 
    SafeAreaView, 
    Text,  
    TouchableOpacity,
    ToastAndroid,
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const BitacorasScreen = ({ navigation }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);    
    const [visible, setVisible] = useState(false);
    const [information, setInformation] = useState([]); 
    const [refreshing, setRefreshing] = useState(false);
    const [isInternetReachable, setIsInternetReachable] = useState(true);
        
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
        let response = getOrder(user?._id, true);    
        response.then((resp: any) => {
            setInformation(resp.data.ordentrabajoDB);
            let count = Object.keys(resp.data.ordentrabajoDB).length;
            if (count == 0) {
                ToastAndroid.show('No hay bitácoras.', ToastAndroid.LONG);  
            }  
            setIsLoading(false);
            setRefreshing(false);
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const goTo = (_id: any, id: any, trabajo: any) => {        
        navigation.push('MyPages', { 
            screen: 'NotaTrabajoScreen', 
            params: { 
                'ordenTrabajo': _id,
                'ordenTrabajoId': id,
                'trabajo': trabajo,
            },
        });
    }

    const toggleOverlay = () => {
        setVisible(!visible);
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
                    text: 'BITÁCORAS', 
                    style: listStyle.header
                }}
            />

            {!isLoading ? 
            (
                <FlatList
                    data={ information }    
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }          
                    renderItem={ ({ item }) =>
                    <TouchableOpacity 
                        onPress={ ()=>{ goTo(
                                item._id, 
                                item.id,
                                item.trabajo._id,
                            )} 
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
                                        <Badge style={{ padding: 14 }} value='ABIERTA' status='primary' />                                                
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
                            {
                                (!item.trabajo.bitacora)
                                ?
                                <View style={ listStyle.containerText }>
                                    <View style={{ width: '5%' }}>
                                        <Icon
                                            style={{ paddingTop: 3 }}
                                            name='chain'
                                            size={12} 
                                            type='font-awesome'
                                            color='#74747d'
                                        />
                                    </View>
                                    <View style={{ width: '95%', paddingLeft: 5 }}>
                                        {
                                            (!item.trabajo.fechaMejora)
                                            ?
                                            <Text style={ listStyle.text}>
                                                IDENTIFICACIÓN: { item.idviga }
                                            </Text>  
                                            :
                                            <Text style={ listStyle.text}>
                                                N° APTO: { item.idviga }
                                            </Text>
                                        }                                        
                                    </View>
                                </View>  
                                :
                                null
                            }                            
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
