import React from "react";
import { Image, View } from "react-native";

export const WhiteLogo = () => {
    return (
        <View
            style={{
                alignItems: 'center'
            }}
        >
            <Image 
                source={ require('../assets/logo.png') }
                style={{
                    width: 340,
                    height: 160
                }}                
            />
        </View>
    );
}