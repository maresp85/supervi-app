import React from "react";
import { View } from "react-native";
import colors from "../theme/colors";

export const Background = () => {
    return (
        <View
            style={{
                position: 'absolute',
                backgroundColor: colors.primaryColor,
                top: -180,
                width: 800,
                height: 1000,
                transform: [
                    { rotate: '-70deg'}
                ]
            }}
        />
    );
}