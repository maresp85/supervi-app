import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';

import { 
    getItemActividad,
    getImgOrdenActividad,
    getOrdenActividad,
    getCheckOrdenActividad,
} from '../api/adminApi';

import { CheckBox, Header as HeaderRNE, Icon } from '@rneui/themed';

import {
    ActivityIndicator, 
    Alert,
    FlatList,
    Image,
    SafeAreaView, 
    ScrollView, 
    Text,
    TouchableOpacity,
    View 
} from 'react-native';

import { listStyle } from '../theme/listTheme';
import settings from '../theme/settings';
import colors from '../theme/colors';

import Moment from 'moment';
import 'moment/locale/es';

interface Props extends StackScreenProps<any, any> {}

export const ListarNotaScreen = ({ navigation, route }: Props) => {

    Moment.locale('es');
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);    
    const [visible, setVisible] = useState(false);
    const [information, setInformation] = useState([]); 
    const [informationImg, setInformationImg] = useState([]); 
    const [informationAct, setInformationAct] = useState([]); 
    const [informationCheck, setInformationCheck] = useState([]);
    const [refreshing, setRefreshing] = useState(false); 
    const [_id, set_Id] = useState('');
        
    useEffect(() => {
        getInitialData();    
    }, []);  

    const getInitialData = () => {
        getListadoLegalizacion();
    }

    const getListadoLegalizacion = () => {
        setIsLoading(true);
        
        let response = getItemActividad(route.params.actividad, route.params.cumple);    
        response.then((resp: any) => {           
            setInformation(resp.data.itemactividadDB);
            
            response = getImgOrdenActividad(route.params.ordenActividad);
            response.then((resp: any) => { 
                setInformationImg(resp.data.imgordenactividadDB[0]['files']);

                response = getOrdenActividad(route.params.ordenActividad);
                response.then((resp: any) => {                                                      
                    setInformationAct(resp.data.ordenactividadDB[0]);
                }).catch((err: any) => {
                    showAlertError(err.response.data.err.errmsg);  
                });

                response = getCheckOrdenActividad(route.params.ordenActividad);
                response.then((resp: any) => { 
                    setInformationCheck(resp.data.checkOrdenActividadDB);
                     
                }).catch((exception: any) => {
                    showAlertError(exception.response.data.err.message);  
                }); 

            }).catch((err: any) => {
                showAlertError(err.response.data.err.errmsg);    
            });
            
        }).catch((err: any) => {
            showAlertError(err.response.data.err.errmsg);  
        });
    }

    const goBack = () => {        
        navigation.push('MyPages', { 
            screen: 'NotaTrabajoScreen', 
            params: { 
                'ordenTrabajo': route.params.ordenTrabajo,
                'ordenTrabajoId': route.params.ordenTrabajoId,
                'trabajo': route.params.trabajo,
            },
        });
    }

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
                    text: 'CONSULTA NOTA', 
                    style: listStyle.header
                }}
                leftComponent={
                    <View style={ listStyle.headerButtonLeft }>  
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

        { isLoading ? 
            (
            <ScrollView>                           
                <FlatList
                    data={ information }
                    keyExtractor={ item => item._id }
                    renderItem={({ item }) => {                                
                        if (item.tipo == "FIRMA DIGITAL") {
                            return <View style={ listStyle.item }>
                                        <Text style={ listStyle.title2 }>
                                            { item.etiqueta }
                                        </Text> 
                                        <View style={ listStyle.containerImage }>
                                            <Image 
                                                source={{ uri: `${ settings.baseURL }${ settings.uploadFirmas }${ user?.imgfirma }` + '?' + new Date() }} 
                                                style={ listStyle.imageView }
                                            />
                                        </View>
                                    </View>
                        }                                            

                        if (item.tipo == 'ETIQUETA') {
                            return  <View style={ listStyle.item }>
                                        <Text style={ listStyle.title2 }>{ item.etiqueta }</Text> 
                                    </View>
                        }                        
                    }}   
                    ListFooterComponent={
                        <SafeAreaView>
                            <View style={ listStyle.item }>
                                <Text style={ listStyle.title2 }>Evidencias</Text> 
                                <FlatList
                                    data={ informationImg }
                                    keyExtractor={ item => item.filename }
                                    renderItem={({ item }) => {
                                        return <View style={ listStyle.containerImage }>                                                      
                                                    <Image 
                                                        source={{ uri: `${ settings.baseURL }${ settings.uploadImgOrdenes }${ item.filename }` + '?' + new Date() }} 
                                                        style={ listStyle.imageView }
                                                    />
                                                </View>
                                    }}                                
                                />
                            </View>                           
                            {   
                                informationCheck.map((item: any) => {
                                    return <View style={ listStyle.item }>                      
                                        <CheckBox
                                            size={ 22 }
                                            title={ item.etiqueta }
                                            checked={ true }
                                        />
                                        <Text style={ listStyle.title2 }>
                                            Fecha Mejora:
                                            {
                                                (item.fechaMejora)
                                                ?
                                                <Text style={{ fontWeight: 'normal', fontSize: 15 }}>
                                                    { ` ${ item.fechaMejora }` }
                                                </Text>
                                                :
                                                <Text style={{ fontWeight: 'normal', fontSize: 15 }}>
                                                    { ` Sin fecha de mejora.` }
                                                </Text>
                                            }                                            
                                        </Text>     
                                    </View>
                                })
                            }
                            <View style={ listStyle.item }>
                                <Text style={ listStyle.title2 }>
                                    Fecha Legalización:                                 
                                    <Text style={{ fontWeight: 'normal', fontSize: 15 }}>
                                        { ` ${ Moment(informationAct.fechalegaliza).format('L') } ${ Moment(informationAct.fechalegaliza).format('LT') }` }  
                                    </Text>            
                                </Text>                            
                            </View>
                            <View style={ listStyle.item }>
                                <Text style={ listStyle.title2 }>
                                    Observaciones
                                </Text>  
                                <Text>
                                    { informationAct.observacion }
                                </Text>                                      
                            </View>
                            {
                                (informationAct.fechaMejora) 
                                ?  
                                <View style={ listStyle.item }>
                                    <Text style={ listStyle.title2 }>Fecha proyectada de Mejora: </Text> 
                                    <Text style={{ fontWeight: 'normal', fontSize: 15 }}>
                                        { informationAct.fechaMejora }                           
                                    </Text> 
                                </View>
                                :
                                null
                            }
                        </SafeAreaView>                   
                    }                          
                />                    
            </ScrollView>
            ) : (
                <ActivityIndicator style={{ marginTop: 10 }} size="large" color={ colors.backgroundColor2 } />
            )
        }                              
        </SafeAreaView>
    );
}
