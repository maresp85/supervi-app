import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import colors from '../theme/colors';
//Screens
import { LoginScreen } from '../screens/LoginScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { OrdenesScreen } from '../screens/OrdenesScreen';
import { BitacorasScreen } from '../screens/BitacorasScreen';
import { CrearOrdenesScreen } from '../screens/CrearOrdenesScreen';
import { TipoTrabajoScreen } from '../screens/TipoTrabajoScreen';
import { NotaTrabajoScreen } from '../screens/NotaTrabajoScreen';
import { ActividadesScreen } from '../screens/ActividadesScreen';
import { ListarLegalizacionScreen } from '../screens/ListarLegalizacionScreen';
import { ListarNotaScreen } from '../screens/ListarNotaScreen';
import { LegalizacionScreen } from '../screens/LegalizacionScreen';
import { GuardarNotaScreen } from '../screens/GuardarNotaScreen';

import { UtilityScreen } from '../screens/UtilityScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { BuscarOrdenesScreen } from '../screens/BuscarOrdenesScreen';
import { SignatureScreenPage } from '../screens/SignatureScreenPage';

const Pages = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export const Navigator = () => {

    const { status } = useContext(AuthContext);

    if (status === 'checking') return <LoadingScreen />

    const MyPages = () => (
        <Pages.Navigator>
            <Pages.Screen 
                name='NotaTrabajoScreen' 
                component={ NotaTrabajoScreen } 
                options={{ 
                    title: 'Notas Bitácora',
                    headerShown: false,
                }}                 
            />             
            <Pages.Screen 
                name='TipoTrabajoScreen' 
                component={ TipoTrabajoScreen } 
                options={{ 
                    title: 'Tipo de Trabajo',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='ActividadesScreen' 
                component={ ActividadesScreen } 
                options={{ 
                    title: 'Actividades',
                    headerShown: false,
                }}                 
            />     
            <Pages.Screen 
                name='GuardarNotaScreen' 
                component={ GuardarNotaScreen } 
                options={{ 
                    title: 'Guardar Nota',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='LegalizacionScreen' 
                component={ LegalizacionScreen } 
                options={{ 
                    title: 'Legalizacion',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='ListarLegalizacionScreen' 
                component={ ListarLegalizacionScreen } 
                options={{ 
                    title: 'Listar Legalizacion',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='ListarNotaScreen' 
                component={ ListarNotaScreen } 
                options={{ 
                    title: 'Listar Nota',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='ProfileScreen'
                component={ ProfileScreen } 
                options={{ 
                    title: 'Mi Perfil',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='BuscarOrdenesScreen' 
                component={ BuscarOrdenesScreen } 
                options={{ 
                    title: 'Buscar Ordenes',
                    headerShown: false,
                }}                 
            />
            <Pages.Screen 
                name='CrearOrdenesScreen' 
                component={ CrearOrdenesScreen } 
                options={{ 
                    title: 'Crear Ordenes',
                    headerShown: false,
                }}                 
            />      
            <Pages.Screen 
                name='SignatureScreenPage' 
                component={ SignatureScreenPage } 
                options={{ 
                    title: 'Firma digital',
                    headerShown: false,
                }}                 
            />
        </Pages.Navigator>
    );

    function MyTabs() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName: any;        
                        if (route.name === 'OrdenesScreen') {
                            iconName = focused ? 'clipboard-list' : 'clipboard-list-outline';
                        } else if (route.name === 'BitacorasScreen') {
                            iconName = focused ? 'clipboard-check' : 'clipboard-check-outline';                     
                        } else if (route.name === 'UtilityScreen') {
                            iconName = focused ? 'cog' : 'cog-outline';
                        }                        
            
                        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: colors.backgroundColor,
                    tabBarInactiveTintColor: '#878787',
                })}
            >
                <Tab.Screen 
                    name='OrdenesScreen'
                    component={ OrdenesScreen } 
                    options={{ 
                        title: 'Ordenes',
                        headerShown: false
                    }}                        
                />
                <Tab.Screen 
                    name='BitacorasScreen' 
                    component={ BitacorasScreen } 
                    options={{ 
                        title: 'Bitácoras',
                        headerShown: false,
                        unmountOnBlur: true, 
                    }}    
                />      
                <Tab.Screen 
                    name='UtilityScreen'
                    component={ UtilityScreen } 
                    options={{ 
                        title: "Utilidades",
                        headerShown: false,
                        unmountOnBlur: true,
                    }}    
                />
            </Tab.Navigator>
            );
    }

    return (        
        <Stack.Navigator
            screenOptions={{
                headerShown: false,               
                cardStyle: {
                    backgroundColor: 'white'
                }
            }}
        >
            {
                (status !== 'authenticated')
                ? (
                    <>
                        <Stack.Screen name='LoginScreen' component={ LoginScreen } />
                    
                    </>
                ) : (
                    <>
                        <Stack.Screen name='MyTabs' component={ MyTabs } />
                        <Stack.Screen name='MyPages' component={ MyPages } />
                    </>
                )
            }           
        </Stack.Navigator>
    );
}