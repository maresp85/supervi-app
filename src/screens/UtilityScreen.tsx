import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { StackScreenProps } from '@react-navigation/stack';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Dialog, ListItem, Icon, Header as HeaderRNE } from '@rneui/themed';
import { listStyle } from '../theme/listTheme';
import colors from '../theme/colors';

interface Props extends StackScreenProps<any, any> {}

export const UtilityScreen =  ({ navigation }: Props) => {

  const { route, logOut } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
    
  const toggleDialog = () => {  
    setVisible(!visible);
  };

  const list = [
    {
      title: 'Mi Perfil',
      icon: 'person',
      weight: 'normal',
    },
    {
      title: 'Crear Ordenes',
      icon: 'post-add',
      weight: 'normal',
    },
    {
      title: 'Búsqueda de Ordenes',
      icon: 'search',
      weight: 'normal',
    },
    {
      title: 'Cerrar Sesión',
      icon: 'exit-to-app',
      weight: 'bold',
    },   
  ];

  const optionSelected = (index: any) => {
    if (index == 3) {
      closeSession();
    } else if (index == 0) {
      goTo('ProfileScreen');
    } else if (index == 1) {
      goTo('CrearOrdenesScreen');
    } else if (index == 2) {
      goTo('BuscarOrdenesScreen');
    }
  }

  const goTo = (page: string) => {
    navigation.push('MyPages', { 
      screen: page,
    });
  }

  const closeSession = () => {
    logOut();
  }

  return (    
    <SafeAreaView style={ listStyle.container }>   

      <HeaderRNE
        backgroundColor={ colors.backgroundColor }
        centerComponent={{
            text: 'Utilidades', 
            style: listStyle.header
        }}
      />

      <Dialog
        isVisible={ visible }
        onBackdropPress={ toggleDialog }
      >
        <Dialog.Title title="¿Desea Cerrar Sesión?"/>
        <Dialog.Actions>
            <Dialog.Button
                title="CONFIRMAR"
                onPress={ closeSession }
            />
            <Dialog.Button title="CANCELAR" onPress={ toggleDialog } />
        </Dialog.Actions>
      </Dialog>

      <View>
      {
        list.map((item, i) => (
          <TouchableOpacity 
            onPress={ () => optionSelected(i) }
          >  
            <ListItem key={ i } bottomDivider>
              <Icon name={ item.icon } />
              <ListItem.Content>
                <ListItem.Title style={{fontWeight: item.weight}}>{ item.title }</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
          </TouchableOpacity>  
        ))
      }
      </View>
    </SafeAreaView>
  );
}