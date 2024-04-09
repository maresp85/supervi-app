import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { Badge, Button, Icon, Header as HeaderRNE } from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,
    Image, 
    RefreshControl, 
    SafeAreaView, 
    Text,
    ToastAndroid,
    TouchableOpacity, 
    View 
} from 'react-native';

import { getOrderTipoTrabajo, getOneWorkOrder } from '../api/adminApi';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';
import settings from '../theme/settings';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const TipoTrabajoScreen = ({ navigation, route }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [information, setInformation] = useState([]);
    const [information2, setInformation2] = useState({});
    const [refreshing, setRefreshing] = useState(false);    
    const [ordenEstado, setOrdenEstado] = useState('');
    const [ordenNombre, setOrdenNombre] = useState('');
        
    useEffect(() => {
        getInitialData();    
    }, []);

    const getInitialData = () => {
        getOrdenTrabajo().then(() => {
            getTipoTrabajo();
        });
    }

    const getOrdenTrabajo = () => {
        setIsLoading(true);
        let response = getOneWorkOrder(route.params.ordenTrabajo);
        return response.then((resp: any) => {
            setInformation2(resp.data.ordentrabajoDB[0]);
        }).catch((exception: any) => {
            showAlertError(exception.response.data.err.message);
        });
    }

    const getTipoTrabajo = () => {        
        setIsLoading(true);        
        let response = getOrderTipoTrabajo(route.params.ordenTrabajo);    
        response.then((resp: any) => {            
            setInformation(resp.data.ordentipotrabajoDB);            
            const estados = resp.data.ordentipotrabajoDB.map((x: any) => x.estado);
            const tipoTrabajos = resp.data.ordentipotrabajoDB.map((x: any) => x.tipotrabajo.nombre);       
            setOrdenEstado(estados);
            setOrdenNombre(tipoTrabajos);
            setIsLoading(false);
            setRefreshing(false);
        }).catch((exception: any) => {
            showAlertError(exception.response.data.err.message);  
        });
    }

    const goTo = (
        ordenTipoTrabajo: any,
        orden: any, 
        legalizaCualquierOrden: any, 
        bitacora: boolean
    ) => {
        if (orden > 1 && !legalizaCualquierOrden) {
            if (ordenEstado[orden-2] !== 'CUMPLE') {
                ToastAndroid.showWithGravity(
                    `${ ordenNombre[orden-2] } aún no CUMPLE`, 
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                );
                return;
            }            
        }
        navigation.push('MyPages', { 
            screen: 'ActividadesScreen', 
            params: { 
                'ordenTipoTrabajo': ordenTipoTrabajo,
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
                'bitacora': bitacora,
            }, 
        });        
    }

    const goHome = () => {
        navigation.push('MyTabs', { 
            screen: 'OrdenesScreen',
        });
    }

    const goSignature = () => {
        navigation.push('MyPages', { 
            screen: 'SignatureScreenPage', 
            params: {
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
            }, 
        }); 
    }

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        setRefreshing(false);   
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    const onRefresh = React.useCallback(() => {         
        setRefreshing(true);
        getOrdenTrabajo();
        getTipoTrabajo();
    }, []);  
    
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'TIPOS DE TRABAJO', 
                    style: listStyle.header
                }}
                rightComponent={
                    <View style={ listStyle.headerButton }>  
                        {                            
                            <TouchableOpacity onPress={ goHome }>
                                <Icon 
                                    name='home'
                                    size={ 18 } 
                                    type='font-awesome' 
                                    color='white'
                                />
                            </TouchableOpacity>
                        }             
                    </View>
                }
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
                        onPress={ ()=>{ 
                            goTo(
                                item._id,
                                item.orden, 
                                item.trabajo.legalizaCualquierOrden, 
                                item.trabajo.bitacora
                            ) 
                        } }
                    >                        
                        <View style={ listStyle.item }>

                            <View style={ listStyle.containerText }>
                                <View style={{ width: '70%' }}>                                    
                                    <Text style={ listStyle.title }>
                                        { item.tipotrabajo.orden } - { item.tipotrabajo.nombre }
                                    </Text>   
                                </View>
                                <View style={{ width: '30%' }}>                                
                                    <View style={{ paddingTop: 3 }}>
                                        { item.estado === 'ASIGNADA' ? 
                                            <Badge style={{ padding: 14 }} value={ item.estado } status='primary' />
                                            : null 
                                        }
                                        { 
                                            (item.estado === 'CUMPLE' && !item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 20 }} value={ item.estado } status='success' />
                                            : 
                                            null 
                                        } 
                                        { 
                                            (item.estado === 'CUMPLE' && item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 20 }} value='CERRADA' status='success' />
                                            : 
                                            null 
                                        }
                                        { 
                                            (item.estado === 'NO CUMPLE' && !item.trabajo.bitacora)
                                            ? 
                                            <Badge style={{ padding: 10 }} value={ item.estado } status='error' />
                                            : 
                                            null 
                                        }
                                        { 
                                            (item.estado === 'NO CUMPLE' && item.trabajo.bitacora)
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

                        </View>
                    </TouchableOpacity> }
                    keyExtractor={item => item._id}
                    ListHeaderComponent={
                        <View>                            
                            <Text style={ listStyle.title4 }>
                                { `ORDEN TRABAJO N° ${route.params.ordenTrabajoId}` }
                            </Text>
                        </View>                   
                    }
                    ListFooterComponent={
                        <View style={ listStyle.buttonContainer }>
                            <View>                                
                                <Text style={ listStyle.title2 }>Firma digital</Text>                          
                                {
                                (information2.firmaUsuario)
                                ? 
                                <View style={ listStyle.containerImage }>                                                                                  
                                    <Image 
                                        source={{ uri: `${ settings.baseURL }${ settings.uploadSignatureImage }${ information2.firmaUsuario }` + '?' + new Date() }} 
                                        style={ listStyle.imageView }
                                    />
                                </View>
                                :
                                <TouchableOpacity onPress={ goSignature }>
                                    <Icon
                                        raised
                                        name='pencil'
                                        size={ 18 }
                                        type='font-awesome'
                                        color={ '#E86267' }
                                    />
                                </TouchableOpacity>                  
                                }
                            </View>
                            <View style={{ marginVertical: 16 }}>
                                <View style={{ marginBottom: 6 }}>
                                    <Text style={ listStyle.title }>CAMPOS ADICIONALES DE LA ORDEN</Text>
                                </View>                    
                                {information2.extraFieldsData && information2.extraFieldsData.map((item: any, index: any) => (
                                    <View key={index}>
                                        <Text style={listStyle.title2}>
                                            {item.field}:
                                        </Text>
                                        <Text style={listStyle.text}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>                       
                        </View>
                    }
                />                       
            ) : (
                <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
            )}                     
        </SafeAreaView>  
    );
}
