import React, { useContext, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

import { 
    buscarOrdenes, 
    getTrabajo, 
    getObraUsuario, 
    updateVigaOrder 
} from '../api/adminApi';

import { 
    Badge, 
    Button, 
    Header as HeaderRNE, 
    Icon, 
    Overlay 
} from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,
    Keyboard,
    SafeAreaView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const BuscarOrdenesScreen = ({ navigation }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false); 
    const [isVisibleOverlay, setIsVisibleOverlay] = useState(false); 
    const [isVisible, setIsVisible] = useState(false);
    const [idViga, setIdViga] = useState('');
    const [titleViga, setTitleViga] = useState('');
    const [dataConteo, setDataConteo] = useState(0);
    const [identificacion, setIdentificacion] = useState('');
    const [_id, set_Id] = useState();
    const [id, setId] = useState();
    const [information, setInformation] = useState([]);
    const [informationTrabajo, setInformationTrabajo] = useState([]);
    const [informationObra, setInformationObra] = useState([]);
    const [trabajoSelected, setTrabajoSelected] = useState('');
    const [obraSelected, setObraSelected] = useState('');
    const [estadoSelected, setEstadoSelected] = useState('');
    const [datePicker, setDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());
    const [valueFecha, setValueFecha] = useState('');
    const [estados, setEstados] = useState(
        [
            { '_id': 'ASIGNADA', 'nombre': 'ASIGNADA' },
            { '_id': 'EN PROCESO', 'nombre': 'EN PROCESO' },
            { '_id': 'CUMPLE', 'nombre': 'CUMPLE' },
            { '_id': 'NO CUMPLE', 'nombre': 'NO CUMPLE' },
        ]
    );
        
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
            setInformationTrabajo(resp.data.trabajoDB);
            setIsLoading(false);
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
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const buscarOrden = () => { 
        Keyboard.dismiss();
        setIsLoading(true);

        let response = buscarOrdenes(
            user?.empresa[0],
            id,
            user?._id,
            estadoSelected,
            identificacion,
            trabajoSelected,
            obraSelected,
            valueFecha,
        );

        setIdentificacion('');       
        setValueFecha('');   
        setTrabajoSelected('');
        setObraSelected('');
        setEstadoSelected('');

        response.then((resp: any) => {
            setIsLoading(false);
            setInformation(resp.data.ordentrabajoDB);    
            let count = Object.keys(resp.data.ordentrabajoDB).length
            setDataConteo(count);
            if (count == 0) {
                ToastAndroid.show('La búsqueda no arrojó resultados', ToastAndroid.LONG);  
            }            
        }).catch((err: any) => {
            setIsLoading(false);
            Alert.alert('Ocurrió un error, contacte al Administrador');
        });
    }

    const goTo = (_id: any, id: any, viga: any, fechaMejora: any, bitacora: any) => {
        if (bitacora) {
            navigation.push('MyPages', { 
                screen: 'TipoTrabajoScreen', 
                params: { 
                    'ordenTrabajo': _id,
                    'ordenTrabajoId': id,
                },
            });
            return;            
        }
        setId(id);
        set_Id(_id);
        setTitleViga('DIGITE EL N° DE IDENTIFICACIÓN');
        if (fechaMejora) {
            setTitleViga('DIGITE EL N° DE APTO');
        }
        if (viga == 'NO') {
            toggleOverlay();
        } else {
            setIdViga('');            
            navigation.push('MyPages', { 
                screen: 'TipoTrabajoScreen', 
                params: { 
                    'ordenTrabajo': _id,
                    'ordenTrabajoId': id,
                },
            });
        }
    }

    const updateViga = () => {   
        toggleOverlay();
        setIsLoading(true);
        let response = updateVigaOrder(_id, idViga);
        response.then((resp: any) => {
            setIdViga('');
            navigation.push('MyPages', { 
                screen: 'TipoTrabajoScreen', 
                params: { 
                    'ordenTrabajo': _id,
                    'ordenTrabajoId': id,
                }, 
            });
        }).catch((err: any) => {
            setIsLoading(false);
            Alert.alert('Ocurrió un error, contacte al Administrador');
        });
    };   

    const toggleOverlay = () => {
        setIsVisibleOverlay(!isVisibleOverlay);
    };

    const buscarAvanzado = () => {
        setIsVisible(false);
        buscarOrden();
    }

    const renderTrabajo = () => {
        return informationTrabajo.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />;
        });
    };

    const renderObra = () => {
        return informationObra.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />;
        });
    };

    const renderEstado = () => {
        return estados.map((obj: any, index: number) => {
            return <Picker.Item key={ index } label={ obj.nombre } value={ obj._id } />;
        });
    };

    const showDatePicker = async () => {
        setDatePicker(true);      
    };

    const dateSelected = (event: any, value: any) => {      
        setDatePicker(false);
        if (event.type == 'set') {
            setValueFecha(Moment(value).format('YYYY-MM-DD'));
        }
    }; 

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }

    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'BUSCAR ORDENES', 
                    style: listStyle.header
                }}
            />

            <Overlay isVisible={ isVisibleOverlay } onBackdropPress={ toggleOverlay }>
                <View>
                    <Text style={ listStyle.title }>{ titleViga }</Text>
                    <TextInput 
                        style={ listStyle.inputField } 
                        underlineColorAndroid='rgba(0,0,0,0)' 
                        onChangeText={ (value) => setIdViga(value) }
                        value={ idViga } 
                        placeholderTextColor="#4b4b56" 
                    />   
                    <View style={{ marginTop: 8 } }>
                        <Button 
                            title='Enviar'
                            buttonStyle={{ backgroundColor: colors.backgroundColor4 }}
                            onPress={ updateViga } 
                        />
                    </View>
                </View>
            </Overlay>

            <View>
                {
                    datePicker && (
                        <DateTimePicker
                            value={date}
                            mode={'date'}
                            display={'default'}
                            is24Hour={true}
                            onChange={dateSelected}
                        />
                    )
                }
            </View>
            <View style={{ marginLeft: 16, width: 335 }}>
                <TextInput 
                    style={ listStyle.inputField } 
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder='Digite el N° identificación'
                    onChangeText={ (identificacion) => setIdentificacion(identificacion) }
                    onSubmitEditing={ buscarAvanzado }
                    value={ identificacion } 
                    placeholderTextColor='#4b4b56'
                /> 
            </View>   
            <Picker
                selectedValue={ trabajoSelected }
                style={{ height: 20, width: 370 }}
                onValueChange={(itemValue, itemIndex) =>
                    setTrabajoSelected(itemValue)
                }
            >
                <Picker.Item label='Seleccione un Tipo de Trabajo' value='' />
                { renderTrabajo() }
            </Picker>
            <Picker
                selectedValue={ obraSelected }
                style={{ height: 20, width: 370 }}
                onValueChange={(itemValue, itemIndex) =>
                    setObraSelected(itemValue)
                }
            >
                <Picker.Item label='Seleccione una Obra' value='' />
                { renderObra() }
            </Picker>
            <Picker
                selectedValue={ estadoSelected }
                style={{ height: 20, width: 370 }}
                onValueChange={(itemValue, itemIndex) =>
                    setEstadoSelected(itemValue)
                }
            >
                <Picker.Item label='Seleccione un Estado' value='' />
                { renderEstado() }
            </Picker>

            <View style={{ flexDirection: 'row', marginLeft: 9, padding: 8 }}>
                <View style={{ width: '80%' }}>    
                    <Text style={ listStyle.title5 }>
                        Fecha de Creación { valueFecha }
                    </Text>
                </View>
                <View style={{ width: '20%', marginLeft: 20 }}>  
                    <Icon
                        raised
                        onPress={ () => showDatePicker() }
                        name='calendar'
                        size={ 16 }
                        type='font-awesome'
                        color={ colors.backgroundColor4 }
                    />
                </View>   
            </View>                       
    
            <View style={{ marginTop: 4, padding: 4 }}>
                <Button 
                    buttonStyle={{ backgroundColor: colors.primaryColor }}
                    titleStyle={{ color: 'black' }}
                    title='BUSCAR'
                    onPress={ buscarAvanzado } 
                />
            </View>

            <View>
            {
                (!isLoading)
                ? 
                (
                <View style={ listStyle.resultados }>
                    <Text>Resultados: { dataConteo }</Text>
                </View>
                )
                :
                null
            }
            </View>

            <KeyboardAwareScrollView style={{ height: '100%'}}>   
            {
                (!isLoading)
                ? 
                (
                    <FlatList
                        data={ information }      
                        renderItem={ ({ item }) =>
                        <TouchableOpacity 
                            onPress={ ()=>{ goTo(
                                item._id, 
                                item.id, 
                                item.idviga, 
                                item.trabajo.fechaMejora, 
                                item.trabajo.bitacora
                            ) } 
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
                )
                :
                <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
            }
            </KeyboardAwareScrollView>
                                
        </SafeAreaView>
    );
}
