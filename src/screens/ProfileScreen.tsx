import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { Header as HeaderRNE } from '@rneui/themed';
import { Image, SafeAreaView, Text, View } from 'react-native';

import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';
import settings from '../theme/settings';

interface Props extends StackScreenProps<any, any> {}

export const ProfileScreen = ({ navigation }: Props) => {

    const { user } = useContext(AuthContext);
 
    return (
        <SafeAreaView style={ listStyle.container }>

            <HeaderRNE
                backgroundColor={ colors.backgroundColor }
                centerComponent={{
                    text: 'Mi Perfil', 
                    style: listStyle.header
                }}
            />                        
                <View style={ listStyle.containerSearch }>
                    <Text style={ listStyle.title2 }>
                        Nombre:
                    </Text> 
                    <Text style={ listStyle.text }>
                        { ` ${user?.nombre}` }
                    </Text> 
                </View>

                <View style={ listStyle.containerSearch }>
                    <Text style={ listStyle.title2 }>
                        Correo electrónico:
                    </Text> 
                    <Text style={ listStyle.text }>
                        { ` ${user?.email}` }
                    </Text> 
                </View>

                <View style={ listStyle.containerSearch }>
                    <Text style={ listStyle.title2 }>
                        Perfil: 
                    </Text> 
                    <Text style={ listStyle.text }>
                        { ` ${user?.role}` }
                    </Text> 
                </View>

                <View style={ listStyle.containerSearch }>
                    <Text style={ listStyle.title2 }>
                        Firma: 
                    </Text> 
                </View>
                <View style={ listStyle.containerSearch }>
                    <Text style={ listStyle.text }>
                        <View style={ listStyle.containerImage }>
                            <Image 
                                source={{ uri: `${ settings.baseURL }${ settings.uploadFirmas }${ user?.imgfirma }` + '?' + new Date() }} 
                                style={ listStyle.imageView }
                            />
                        </View>
                    </Text> 
                </View>
                  
        </SafeAreaView> 
    );
}
