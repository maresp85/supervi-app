import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { setPayment, getVerifyPaymentAmount } from "./adminApi";

import Moment from 'moment';
import 'moment/locale/es-do';
Moment.locale('es-do');

export const setPaymentStorage = async(
    keyName: string,
    amount: any,    
    creditId: any,
    clientName: string,
    cardImage: any,
    siteImage: any,
    observation: string,
    userName: any, 
    latitude: any,
    longitude: any,
) => {
    let cardImageSave: any;
    if (Object.keys(cardImage).length > 0) {
        cardImageSave = await saveImage(cardImage.uri);
    }

    let siteImageSave: any;
    if (Object.keys(siteImage).length > 0) {
        siteImageSave = await saveImage(siteImage.uri);
    }

    let payment: any = {   
        'amount': amount,
        'creditId': creditId,
        'clientName': clientName,
        'cardImage': cardImageSave,
        'siteImage': siteImageSave,
        'observation': observation,
        'username': userName,
        'latitude': latitude,
        'longitude': longitude,  
        'date': Date.now(), 
        'keyName': keyName,
        'offline': true,
    }

    await AsyncStorage.setItem(keyName, JSON.stringify(payment));
};

const saveImage = async (uri: string) => {
    try {
      // Request device storage access permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === "granted") {
        // Save image to media library
        let asset: any = await MediaLibrary.createAssetAsync(uri);
        MediaLibrary.createAlbumAsync('REC', asset);
        return asset
      }
    } catch (error) {
      console.log(error);
    }
}

const getImage = async (uri: string) => {
    let base64: any = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    let resp = {
        'base64': base64,
        'uri': uri
    }
    
    return resp;
}

export const removePaymentStorage = async (keyName: string) => {
    try {
        let payment: any = await AsyncStorage.getItem(keyName); 
        payment = JSON.parse(payment);
        await MediaLibrary.deleteAssetsAsync(payment.cardImage);
        await MediaLibrary.deleteAssetsAsync(payment.siteImage);
        await AsyncStorage.removeItem(keyName);
    } catch (error) {
      console.log(error);
    }
};  

export const sendPaymentStorage = async () => {
    importData().then((item: any) => {     
        item.forEach(async (elem: any, index: any) => { 
            if (elem[0].startsWith('payment_')) { 
                
                let keyName = elem[0];
                let payment = JSON.parse(elem[1]);

                if (Moment(payment.date).format('L') == Moment(new Date()).format('L')) {  
                    
                    setTimeout(() => {   
                        let response = getVerifyPaymentAmount(payment.creditId, payment.amount);
                        response.then(async (resp: any) => {   
                            //get images from gallery
                            let cardImage: any = {};                            
                            if (payment.cardImage) {
                                try {
                                    cardImage = await getImage(payment.cardImage.uri);
                                } catch (error) {
                                    console.log('Error al obtener la foto de la tarjeta: ', error);
                                }    
                                try {                                                             
                                    await MediaLibrary.deleteAssetsAsync(payment.cardImage);  
                                } catch (error) {
                                    console.log('Error al borrar la foto de la tarjeta: ', error);
                                }   
                            }

                            let siteImage: any = {};
                            if (payment.siteImage) {                                
                                try {
                                    siteImage = await getImage(payment.siteImage.uri); 
                                } catch (error) {
                                    console.log('Error al obtener la foto del sitio: ', error);
                                }    
                                try {                                                             
                                    await MediaLibrary.deleteAssetsAsync(payment.siteImage);  
                                } catch (error) {
                                    console.log('Error al borrar la foto del sitio: ', error);
                                }         
                            }
                            
                            await AsyncStorage.removeItem(keyName).then(() => {

                                if (!resp.data) { 
                                    setPayment(
                                        payment.amount, 
                                        payment.creditId, 
                                        cardImage, 
                                        siteImage, 
                                        payment.observation, 
                                        payment.username,
                                        payment.latitude,
                                        payment.longitude,
                                        true,
                                        payment.date
                                    );                          
                                }  

                            });

                        });
                    }, 1000);

                } else {
                    await AsyncStorage.removeItem(keyName);
                }         
            }
        });        
    });
};

export const existsDataStorage = async (keyName: string) => {
    return new Promise((resolve, reject) => {
        importData().then((item: any) => {   
            item.forEach((elem: any, idx: number, array: any) => {                
                if (elem[0].startsWith(keyName)) {                    
                    resolve(true);
                }
                if (idx === array.length - 1) {
                    reject(false);
                }
            });
        });
    })
}

export const importData = async () => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);       
        return result;
    } catch (error) {
        console.error(error)
    }
}