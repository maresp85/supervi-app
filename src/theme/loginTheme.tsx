import { StyleSheet } from "react-native";

export const loginStyle = StyleSheet.create({
    formContainer: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        height: 600,
        marginBottom: 50,
    },
    title: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 20,
    },
    label: {
        marginTop: 25,
        color: 'white',
        fontWeight: 'bold',
    },
    labelLogin: {
        marginTop: 25,
        color: 'black',
        fontWeight: 'bold',
    },
    inputField: {
        color: 'white',
        fontSize: 16,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
    },
    inputFieldLogin: {
        color: 'black',
        fontSize: 16,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    buttonContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    button: {
        borderWidth: 2,
        borderColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100,
    },
    buttonLogin: {
        borderWidth: 2,
        borderColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100,
    },
    buttonText: {
        fontSize: 18, 
        color: 'white'
    },
    buttonTextLogin: {
        fontSize: 18, 
        color: 'black'
    },
    newUserContainer: {
        alignItems: 'flex-end',
        marginTop: 10,
    },
    buttonReturn: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
        left: 20,
        paddingHorizontal: 10, 
        paddingVertical: 5,
        position: 'absolute',
        top: 50,
    }
});