import React, { useContext, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import ImgPicker from '../components/ImgPicker';

import {
    getItemActividad,
    getOrdenActividad,
    putEstadoOrdenActividad,
    putInactivaOrdenActividad,
} from '../api/adminApi';

import { Button, CheckBox, Icon, Header as HeaderRNE } from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,
    Image,
    SafeAreaView, 
    Text, 
    TextInput,   
    TouchableOpacity, 
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';
import settings from '../theme/settings';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const LegalizacionScreen = ({ navigation, route }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);      
    const [information, setInformation] = useState([]);
    const [itemCheckListSelected, setItemCheckListSelected] = useState('');
    const [_id, set_Id] = useState('');
    const [fechaMejora, setFechaMejora] = useState('');  
    const [valueFechaMejora, setValueFechaMejora] = useState('');
    const [datePicker, setDatePicker] = useState(false);
    const [datePickerItem, setDatePickerItem] = useState(false);
    const [date, setDate] = useState(new Date()); 
    // Form
    const [image1, setImage1] = useState();
    const [image2, setImage2] = useState();
    const [observaciones, setObservaciones] = useState(''); 
        
    useEffect(() => {
        getItemActividades();
    }, []);

    const getItemActividades = () =>{
        setIsLoading(true);
        let response = getItemActividad(route.params.actividad, route.params.cumple);
        response.then((resp: any) => {            
            setInformationCheck(resp.data.itemactividadDB);

            response = getOrdenActividad(route.params.ordenActividad);
            response.then((resp: any) => {
                setFechaMejora(resp.data.ordenactividadDB[0].tipotrabajo.trabajo[0].fechaMejora);         
                setIsLoading(false);
            }).catch((err: any) => {
                setIsLoading(true);
                showAlertError(err.response.data.err.errmsg);    
            });            
        }).catch((err: any) => {
            setIsLoading(false);
            showAlertError(err.response.data.err.errmsg);
        });
    };

    const tipoLegalizacion = () => {
        if (route.params.relegaliza) {
            setIsLoading(true);
            let response = putInactivaOrdenActividad(route.params.ordenActividad);
            response.then((resp: any) => {
                setIsLoading(false);
                if (resp.data.ok == true) {
                    legalizacion(resp.data.ordenactividadDB._id,);
                }            
            }).catch((err: any) => {
                setIsLoading(false);            
                showAlertError(err.response.data.err.errmsg);  
            });
        } else {
            legalizacion(route.params.ordenActividad);
        }
    }

    const legalizacion = (ordenActividad: any) => {        
        setIsLoading(true);
        let response = putEstadoOrdenActividad(
            ordenActividad,
            route.params.cumple,
            user?._id,
            observaciones,
            valueFechaMejora,
            information,
            image1,
            image2,
        );
        response.then((resp: any) => {
            setIsLoading(false);
            if (resp.data.ok == true) {
                Alert.alert(
                    'Legalización satisfactoria',
                    '',
                    [     
                        {
                            text: 'OK', 
                            onPress: () => navigation.push('MyPages', { 
                                screen: 'ActividadesScreen', 
                                params: { 
                                    'ordenActividad': route.params.ordenActividad,                               
                                    'ordenTipoTrabajo': route.params.ordenTipoTrabajo,
                                    'bitacora': route.params.bitacora,
                                    'ordenTrabajo': route.params.ordenTrabajo,
                                    'ordenTrabajoId': route.params.ordenTrabajoId,
                                }, 
                            })
                        }
                    ],
                        { cancelable: false },
                    );
            }            
        }).catch((err: any) => {
            setIsLoading(false);            
            showAlertError(err.response.data.err.errmsg);  
        });        
    }

    const setInformationCheck = (res: any) => {
        let temp: any = []; 
        res.forEach((item: any) => {           
            temp.push({ 
                _id: item._id, 
                etiqueta: item.etiqueta, 
                tipo: item.tipo,
                isChecked: false,
                fechaMejora: '',
             });           
        });        
        setInformation(temp);
    }

    const checkboxChange = (_id: any) => {
        let temp: any = information.map((item: any) => {
            if (_id === item._id) {
                return { ...item, isChecked: !item.isChecked };
            }
            return item;
        });
        setInformation(temp);
    };

    const datePickerItemFechaMejora = async (_id: any) => {
        setItemCheckListSelected(_id);
        setDatePickerItem(true);      
    };

    const dateSelectedItemFechaMejora = (event: any, value: any) => {      
        setDatePickerItem(false);
        if (event.type == 'set') {            
            let temp: any = information.map((item: any) => {
                if (itemCheckListSelected === item._id) {
                    return { ...item, fechaMejora: Moment(value).format('L') };
                }
                return item;
            });
            setInformation(temp);
        }
    };

    const datePickerFechaMejora = async () => {
        setDatePicker(true);      
    };   

    const dateSelectedFechaMejora = (event: any, value: any) => {      
        setDatePicker(false);
        if (event.type == 'set') {
            setValueFechaMejora(Moment(value).format('L'));
        }
    }; 
    
    const callbackCamera1 = (childData: any) => {
        setImage1(childData);
    }

    const callbackCamera2 = (childData: any) => {
        setImage2(childData);
    }

    const showAlertError = (errorMessage: string) => {
        setIsLoading(false);  
        Alert.alert('Aviso', errorMessage, [{ text: 'Ok' }]);
    }
    
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={colors.backgroundColor}
                centerComponent={{
                    text: 'LEGALIZACIÓN', 
                    style: listStyle.header
                }}
            />  

            {
                datePickerItem && (
                    <DateTimePicker
                        value={date}
                        mode={'date'}
                        display={'default'}
                        is24Hour={true}
                        onChange={dateSelectedItemFechaMejora}
                    />
                )
            }

            {
                datePicker && (
                    <DateTimePicker
                        value={date}
                        mode={'date'}
                        display={'default'}
                        is24Hour={true}
                        onChange={dateSelectedFechaMejora}
                    />
                )
            }

            {!isLoading ? 
            (
                <KeyboardAwareScrollView style={ listStyle.container3 }>    
                    <FlatList
                        data={ information }
                        keyExtractor={ item => item._id }
                        renderItem={({ item }) => {
                            if (item.tipo == 'ETIQUETA') {
                                return  <View style={ listStyle.item }>
                                            <Text style={ listStyle.title2 }>{ item.etiqueta }</Text> 
                                        </View>
                            }  
                            
                            if (item.tipo == 'CHECKLIST') {
                                return  <View style={ listStyle.containerText }>
                                            <View style={{ width: '16%' }}>                           
                                                <CheckBox
                                                    checked={ item.isChecked }
                                                    onPress={ () => checkboxChange(item._id) }
                                                    size={ 22 }
                                                />
                                            </View>
                                            <View style={ listStyle.checkboxLabel }>  
                                                <Text style={ listStyle.title2 }>{ item.etiqueta }</Text>
                                                <Text style={ listStyle.text }>{ item.fechaMejora }</Text>
                                            </View>
                                            <View style={{ width: '18%' }}> 
                                                <Icon
                                                    raised
                                                    onPress={ () => datePickerItemFechaMejora(item._id) }
                                                    name='calendar'
                                                    size={ 17 }
                                                    type='font-awesome'
                                                    color={ colors.backgroundColor4 }
                                                />
                                            </View>                                        
                                        </View>
                            } 
                                
                            if (item.tipo == 'EVIDENCIAS') {
                                return  <View style={ listStyle.item }>                                        
                                            <Text style={ listStyle.title2 }>{ item.etiqueta }</Text> 
                                            <ImgPicker parentCallback = { callbackCamera1 } />  
                                            <ImgPicker parentCallback = { callbackCamera2 } />
                                        </View>
                            }
                            
                            if (item.tipo == 'FIRMA DIGITAL') {
                                if (fechaMejora && !route.params.cumple) {                                        
                                    return <View style={ listStyle.containerText }>
                                                <View style={ listStyle.checkboxLabel }> 
                                                    <Text style={ listStyle.title2 }>Fecha proyectada de Mejora: </Text> 
                                                    <Text style={ listStyle.text }>{ valueFechaMejora }</Text> 
                                                </View>
                                                <View style={{ width: '18%' }}> 
                                                    <Icon
                                                        raised
                                                        onPress={ () => datePickerFechaMejora() }
                                                        name='calendar'
                                                        size={ 17 }
                                                        type='font-awesome'
                                                        color={ colors.backgroundColor4 }
                                                    />
                                                </View>                                                 
                                                <Text style={ listStyle.title2 }>{ item.etiqueta }</Text> 
                                                <View style={ listStyle.containerImage }>
                                                    <Image 
                                                        source={{ uri: `${ settings.baseURL }${ settings.uploadFirmas }${ user?.imgfirma }` + '?' + new Date() }} 
                                                        style={ listStyle.imageView }
                                                    />
                                                </View>
                                            </View>
                                } else {
                                    return <View style={ listStyle.item }>                                                   
                                                <Text style={ listStyle.title2 }>{ item.etiqueta }</Text> 
                                                <View style={ listStyle.containerImage }>
                                                    <Image 
                                                        source={{ uri: `${ settings.baseURL }${ settings.uploadFirmas }${ user?.imgfirma }` + '?' + new Date() }} 
                                                        style={ listStyle.imageView }
                                                    />
                                                </View>
                                            </View>
                                }
                            }

                        }}
                        ListFooterComponent={
                            <SafeAreaView>
                                <View style={ listStyle.item }>
                                    <Text style={ listStyle.title2 }>Observaciones</Text> 
                                    <TextInput 
                                        style={ listStyle.textInput2 } 
                                        underlineColorAndroid='rgba(0,0,0,0)'
                                        onChangeText={(observaciones) => setObservaciones(observaciones)}
                                        value={ observaciones } 
                                        placeholderTextColor='#4b4b56'
                                    />  
                                </View>
                                <View style={ listStyle.buttonContainer }>
                                    <Button 
                                        title='Legalización'
                                        buttonStyle={{ backgroundColor: colors.backgroundColor4 }}
                                        onPress={ tipoLegalizacion } 
                                    />
                                </View>
                            </SafeAreaView>                   
                        } 
                    />                        
                </KeyboardAwareScrollView>
            ) : (
                <ActivityIndicator style={{ marginTop: 10 }} size='large' color={colors.backgroundColor4} />
            )
            }                              
        </SafeAreaView>
    );
}
