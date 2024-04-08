import React, { useState } from 'react';
import { 
    Alert,
    TouchableOpacity, 
    Image, 
    Text, 
    StyleSheet,
    View 
} from 'react-native';
import { Icon } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

const ImgPicker = (props: any) => {
     
    const [pickedImage, setPickedImage] = useState();

    const verifyPermissions = async () => {

        const { status } = await Camera.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permisos insuficientes!',
            'Necesita otorgar permisos para usar la Cámara.',
            [{ text: 'Ok' }]
          );
          return false;
        }
        return true;
    };

    const takeImageHandler = async () => {
        
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        
        const result: any = await ImagePicker.launchCameraAsync({            
            quality: 0.1
        });
      
        setPickedImage(result.uri);
          
        props.parentCallback(result);

        if (result.canceled) {
            return;
        }
        
    };  

    const pickImage = async () => {

        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
          
        const result: any = await ImagePicker.launchImageLibraryAsync({            
            quality: 0.1,
        });

        setPickedImage(result.uri);
          
        props.parentCallback(result);

        if (result.canceled) {
            return;
        }
         
    }

    return (
        <View style={ styles.imagePicker }>
            <View style={ styles.imagePreview }>
                {!pickedImage ? (
                    <Text style={{ color: 'gray', fontSize: 16 }}>{ props.title }</Text>
                    ) : (
                    <Image style={ styles.image } source={{ uri: pickedImage }} />
                )}
            </View>  
            <TouchableOpacity 
                style={ styles.button } 
                onPress={ takeImageHandler }
            >
                <Icon
                    raised
                    name='camera'
                    size={ 18 }
                    type='font-awesome'
                    color={ '#E86267' }
                />
            </TouchableOpacity>          
            <TouchableOpacity 
                style={ styles.button } 
                onPress={ pickImage }
            >
                <Icon
                    raised
                    name='image'
                    size={ 18 }
                    type='font-awesome'
                    color={ '#E86267' }
                />
            </TouchableOpacity>                              
        </View>
    )
};

const styles = StyleSheet.create({
    imagePicker: {
        flexDirection: "row",
        paddingTop: 2,        
    },
    imagePreview: {     
        borderColor: "#ccc",
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: "#fff",         
        fontSize: 16,  
        height: 50,      
        padding: 4,      
        width: '70%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    button: {
        width: "16%",
    }
});

export default ImgPicker;