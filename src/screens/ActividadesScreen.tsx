import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { showMessage } from 'react-native-flash-message';

import { Badge, Header as HeaderRNE, Icon, } from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,    
    RefreshControl, 
    SafeAreaView, 
    Text,
    TouchableOpacity, 
    View 
} from 'react-native';

import { getOrderActividad, deleteOrderActividad } from '../api/adminApi';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const ActividadesScreen = ({ navigation, route }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [information, setInformation] = useState([]);    
    const [refreshing, setRefreshing] = useState(false);
    const [titleHeader, setTitleHeader] = useState('');
    const [subTitleHeader, setSubTitleHeader] = useState('');
    const [options, setOptions] = useState(['']);
        
    useEffect(() => {
        getInitialData();    
    }, []);

    const getInitialData = () => {
        setTitleHeader('ACTIVIDADES');
        setSubTitleHeader('Actividad');
        setOptions(['CUMPLE', 'NO CUMPLE', 'N/A', 'VER']);

        getActividades();
    }

    const getActividades = () => {        
        setIsLoading(true);
        let response = getOrderActividad(route.params.ordenTipoTrabajo);    
        response.then((resp: any) => {            
            setInformation(resp.data.ordenactividadDB);
            setIsLoading(false);
            setRefreshing(false);  
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }  

    const choiceLegalizacion = (ordenActividad: any, actividad: any, estado: any) => {        
        if (estado == 'PENDIENTE') {   
            Alert.alert(
                `¿Legalizar ${subTitleHeader}?`,
                '',
                [     
                 {
                    text: options[0], 
                    onPress: () => navigation.push('MyPages', { 
                        screen: 'LegalizacionScreen', 
                        params: { 
                            'actividad': actividad, 
                            'ordenActividad': ordenActividad, 
                            'ordenTipoTrabajo': route.params.ordenTipoTrabajo,                     
                            'ordenTrabajo': route.params.ordenTrabajo,
                            'ordenTrabajoId': route.params.ordenTrabajoId,
                            'cumple': 1,
                            'relegaliza': 0,
                        }, 
                    })
                 }, 
                 {
                    text: options[1],                
                    onPress: () => navigation.push('MyPages', { 
                        screen: 'LegalizacionScreen', 
                        params: { 
                            'actividad': actividad, 
                            'ordenActividad': ordenActividad, 
                            'ordenTipoTrabajo': route.params.ordenTipoTrabajo,                  
                            'ordenTrabajo': route.params.ordenTrabajo,
                            'ordenTrabajoId': route.params.ordenTrabajoId,
                            'cumple': 0,
                            'relegaliza': 0,
                        }, 
                    })
                 },
                 {
                    text: options[2],                
                    onPress: () => {
                        setIsLoading(false);                       
                        let response = deleteOrderActividad(ordenActividad);
                        response.then((resp: any) => {
                            showFlashMessage(
                                'success',                    
                                `${ subTitleHeader } eliminada correctamente.`,
                                '',
                                3500
                            );
                            getActividades();
                        }).catch((err) => {
                            setIsLoading(true);
                            Alert.alert('Ocurrió un error, contacte al Administrador N/A');
                        });
                    }
                 }
                ],
                    {cancelable: true},
                );

        } else if (estado == 'NO CUMPLE') {
            Alert.alert(
                `¿Legalizar nuevamente la ${subTitleHeader}?`,
                '',
                [     
                 {
                    text: options[0], 
                    onPress: () => navigation.push('MyPages', { 
                        screen: 'LegalizacionScreen', 
                        params: { 
                            'actividad': actividad, 
                            'ordenActividad': ordenActividad, 
                            'ordenTipoTrabajo': route.params.ordenTipoTrabajo,                       
                            'ordenTrabajo': route.params.ordenTrabajo,
                            'ordenTrabajoId': route.params.ordenTrabajoId,
                            'cumple': 1,
                            'relegaliza': 1,
                        }, 
                    })
                 }, 
                 {
                    text: options[1],                
                    onPress: () => navigation.push('MyPages', { 
                        screen: 'LegalizacionScreen', 
                        params: { 
                            'actividad': actividad, 
                            'ordenActividad': ordenActividad, 
                            'ordenTipoTrabajo': route.params.ordenTipoTrabajo,                    
                            'ordenTrabajo': route.params.ordenTrabajo,
                            'ordenTrabajoId': route.params.ordenTrabajoId,
                            'cumple': 0,
                            'relegaliza': 1,
                        }, 
                    })
                 },
                 {
                    text: options[3], 
                    onPress: () => navigation.push('MyPages', { 
                        screen: 'ListarLegalizacionScreen', 
                        params: {
                            'ordenActividad': ordenActividad,
                            'actividad': actividad,
                            'ordenTipoTrabajo': route.params.ordenTipoTrabajo,    
                            'ordenTrabajo': route.params.ordenTrabajo,
                            'ordenTrabajoId': route.params.ordenTrabajoId,
                            'cumple': 1,
                        }, 
                    })
                 }
                ],
                    {cancelable: true},
                );
                
        } else {
            let cumple = (ordenActividad.estado == 'CUMPLE') ? 1 : 0;
            navigation.push('MyPages', { 
                screen: 'ListarLegalizacionScreen', 
                params: {
                    'ordenActividad': ordenActividad,
                    'actividad': actividad,     
                    'ordenTrabajo': route.params.ordenTrabajo,
                    'ordenTrabajoId': route.params.ordenTrabajoId,
                    'cumple': cumple,
                }, 
            })
        }
    }

    const goHome = () => {
        navigation.push('MyTabs', { 
            screen: 'OrdenesScreen',
        });
    }

    const goBack = () => {
        navigation.push('MyPages', { 
            screen: 'TipoTrabajoScreen', 
            params: {
                'ordenTipoTrabajo': route.params.ordenTipoTrabajo,
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
            },
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

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        setRefreshing(false);   
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    const onRefresh = React.useCallback(() => {         
        setRefreshing(true);
        getInitialData();
    }, []);  
    
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: titleHeader, 
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
                        onPress={ ()=>{ choiceLegalizacion(item._id, item.actividad._id, item.estado) } }
                    >  
                        
                        <View style={ listStyle.item }>

                            <View style={ listStyle.containerText }>
                                <View style={{ width: '72%' }}>                                    
                                    <Text style={ listStyle.title3 }>
                                        { item.actividad.nombre }
                                    </Text>   
                                </View>
                                <View style={{ width: '28%' }}>                                
                                    <View style={{ paddingTop: 3 }}>
                                        { item.estado == 'ASIGNADA' ? 
                                            <Badge 
                                                style={{ padding: 14 }} 
                                                value={ item.estado } 
                                                status='primary' 
                                            />
                                            : null 
                                        }
                                        { 
                                            (item.estado == 'CUMPLE' && !route.params.bitacora) 
                                            ? 
                                            <Badge 
                                                style={{ padding: 20 }} 
                                                value={ item.estado } 
                                                status='success' 
                                            />
                                            : null 
                                        } 
                                        { 
                                            (item.estado == 'NO CUMPLE' && !route.params.bitacora) 
                                            ?
                                            <Badge 
                                                style={{ padding: 10 }} 
                                                value={ item.estado } 
                                                status='error' 
                                            />
                                            : null 
                                        }
                                        { 
                                            (item.estado == 'CUMPLE' && route.params.bitacora) 
                                            ? 
                                            <Badge 
                                                style={{ padding: 20 }} 
                                                value='CERRADA' 
                                                status='success' 
                                            />
                                            : null 
                                        } 
                                        { 
                                            (item.estado == 'NO CUMPLE' && route.params.bitacora) 
                                            ?
                                            <Badge 
                                                style={{ padding: 10 }} 
                                                value='ABIERTA'
                                                status='error' 
                                            />
                                            : null 
                                        } 
                                        { 
                                            item.estado == 'EN PROCESO' 
                                            ? 
                                            <Badge 
                                                style={{ padding: 10 }} 
                                                value={ item.estado } 
                                                status='warning' 
                                            />
                                            : null 
                                        }
                                        { item.estado == 'PENDIENTE' ? 
                                            <Badge 
                                                style={{ padding: 10 }} 
                                                value={ item.estado } 
                                                status='primary'
                                                badgeStyle={{ backgroundColor: '#AAA', }}
                                            />
                                            : null 
                                        }                                                   
                                    </View> 
                                </View>
                                {
                                    (route.params.bitacora) 
                                    ?
                                    <View style={ listStyle.containerText }>
                                        <Text style={ listStyle.title3 }>
                                            Consecutivo:
                                        </Text>                                         
                                        <Text style={ listStyle.text }>
                                            {` ${ item.consecutivo }`}
                                        </Text>
                                    </View>
                                    :
                                    null
                                }
                                {
                                    (route.params.bitacora) 
                                    ?
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
                                                { Moment(item.fechacreacion).format('LLL') }
                                            </Text>  
                                        </View>
                                    </View>
                                    :
                                    null
                                }
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
