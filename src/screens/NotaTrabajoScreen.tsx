import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { getNotasBitacora, getActividadesRole, createNoteActividad } from '../api/adminApi';

import { 
    Badge,
    Button,
    Divider,
    Icon, 
    Header as HeaderRNE, Overlay 
} from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,    
    RefreshControl, 
    SafeAreaView, 
    Text,
    ToastAndroid,
    TouchableOpacity, 
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const NotaTrabajoScreen = ({ navigation, route }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [information, setInformation] = useState([]);    
    const [refreshing, setRefreshing] = useState(false);
    const [options, setOptions] = useState(['']);
    const [showModalActividad, setShowModalActividad] = useState(false);
    const [actividadValue, setActividadValue] = useState('');
    const [actividadList, setActividadList] = useState([]);
        
    useEffect(() => {
        getInitialData();    
    }, []);

    const getInitialData = () => {
        getActividadesRoleApi();
        getNotas();
        setOptions(['ABIERTA', 'CERRADA']);
    }

    const getActividadesRoleApi = () => {      
        let response = getActividadesRole(route.params.trabajo, user?.role);    
        response.then((res: any) => {
            setActividadList(res.data.actividadDB);
        }).catch((exception: any) => {
            showAlertError(exception.response.data.err.message);  
        });
    }

    const getNotas = () => {       
        setIsLoading(true);        
        let response = getNotasBitacora(route.params.ordenTrabajo);    
        response.then((res: any) => {            
            setInformation(res.data.ordenactividadDB);         
            setIsLoading(false);
            setRefreshing(false);
        }).catch((exception: any) => {
            showAlertError(exception.response.data.err.message);  
        });
    }      

    const goHome = () => {
        navigation.push('MyTabs', { 
            screen: 'BitacorasScreen',
        });
    }

    const toggleOverlayActividad = () => { 
        setShowModalActividad(!showModalActividad);
    };

    const renderActividadList = () => {
        return actividadList.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />
        });
    };

    const crearNotaActividad = (estado: any) => {
        if (actividadValue == null || actividadValue == '') {
            ToastAndroid.show('Seleccione un tipo de nota', ToastAndroid.LONG);
            return;
        }

        toggleOverlayActividad();
        setActividadValue('');
        setIsLoading(true);        
        let response = createNoteActividad(
            route.params.ordenTrabajo,
            actividadValue,
            user?.empresa,
            user?.role
        );    
        response.then((res: any) => {
            navigation.push('MyPages', { 
                screen: 'GuardarNotaScreen',
                params: { 
                    'actividad': actividadValue, 
                    'ordenActividad': res.data.ordenactividadDB._id, 
                    'ordenTipoTrabajo': res.data.ordenactividadDB.ordentipotrabajo,
                    'bitacora': true,
                    'ordenTrabajo': route.params.ordenTrabajo,
                    'ordenTrabajoId': route.params.ordenTrabajoId,
                    'trabajo': route.params.trabajo,
                    'cumple': estado,
                    'relegaliza': 0,
                }, 
            })

            setIsLoading(false);
            setRefreshing(false);
        }).catch((exception: any) => {
            showAlertError('Ocurrió un error al generar la nueva nota.');  
        });
    }

    const goTo = (ordenActividad: any) => {
        let cumple = (ordenActividad.estado == 'CUMPLE') ? 1 : 0;
        navigation.push('MyPages', { 
            screen: 'ListarNotaScreen', 
            params: {
                'ordenActividad': ordenActividad._id,
                'actividad': ordenActividad.actividad._id,
                'ordenTipoTrabajo': route.params.ordenTipoTrabajo,
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
                'trabajo': route.params.trabajo,
                'cumple': cumple,
            }, 
        })
    }

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        setRefreshing(false);   
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    const onRefresh = React.useCallback(() => {         
        setRefreshing(true);
        getNotas();
    }, []);  
    
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                text: 'NOTAS BITÁCORA', 
                    style: listStyle.header
                }}
                leftComponent={
                    <View style={ listStyle.headerButtonLeft }>  
                        {                            
                            <TouchableOpacity onPress={ toggleOverlayActividad }>
                                <Icon 
                                    name='plus-circle'
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

            <Overlay 
                isVisible={ showModalActividad }
                onBackdropPress={ toggleOverlayActividad }
            >
                <View>
                    <Text style={ listStyle.title }>SELECCIONE EL TIPO DE NOTA</Text>
                    <Divider />
                    <Picker
                        selectedValue={ actividadValue }
                        style={{ height: 20, width: 250 }}
                        onValueChange={(itemValue) =>
                            setActividadValue(itemValue)
                        }
                    >
                        <Picker.Item label='Seleccione una tipo de nota' value='' />
                        { renderActividadList() }
                    </Picker>

                    <View>
                        <View style={{ width: '50%' }}>                                
                            <View style={{ top: 8 }}>
                                <Button 
                                    title='Abierta'
                                    buttonStyle={{ backgroundColor: 'rgba(214, 61, 57, 1)' }}
                                    containerStyle={{
                                        width: 250,
                                        marginHorizontal: 0,
                                        marginVertical: 5,
                                    }} 
                                    onPress={ () => crearNotaActividad(0) } 
                                />
                            </View>
                        </View>
                        <View style={{ width: '50%' }}> 
                            <View style={{ top: 8 }}>
                                <Button 
                                    title='Cerrada'
                                    buttonStyle={{ backgroundColor: 'rgba(76, 175, 80, 1)' }}
                                    containerStyle={{
                                        width: 250,
                                        marginHorizontal: 0,
                                        marginVertical: 5,
                                    }} 
                                    onPress={ () => crearNotaActividad(1) } 
                                />
                            </View>
                        </View>
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
                        onPress={ ()=>{ 
                            goTo(item) 
                        } }
                    >  
                        
                        <View style={ listStyle.item }>

                            <View style={ listStyle.containerText }>
                                <View style={{ width: '70%' }}>                                    
                                    <Text style={ listStyle.title }>
                                        { item.consecutivo } - { item.actividad.nombre }
                                    </Text>   
                                </View>
                                <View style={{ width: '30%' }}>                                
                                    <View style={{ paddingTop: 3 }}>
                                        { 
                                            (item.estado === 'CUMPLE')
                                            ? 
                                            <Badge style={{ padding: 20 }} value='CERRADA' status='success' />
                                            : 
                                            null 
                                        }
                                        { 
                                            (item.estado === 'NO CUMPLE')
                                            ? 
                                            <Badge style={{ padding: 10 }} value='ABIERTA' status='error' />
                                            : 
                                            null 
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
                                { `NOTAS BITÁCORA N° ${route.params.ordenTrabajoId}` }
                            </Text>
                        </View>                   
                    } 
                />                           
            ) : (
                <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
            )}                     
        </SafeAreaView>  
    );
}
