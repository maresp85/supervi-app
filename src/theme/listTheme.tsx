import { StyleSheet } from 'react-native';
import colors from "./colors";

export const iconStyle = {
    color: '#403c3c',
    size: 15,
}

export const listStyle = StyleSheet.create({
    container: { 
        backgroundColor: '#f7fafc',
        flex: 1,       
    },  
    container2: {
        backgroundColor: 'white',
        flex: 1, 
        justifyContent: 'flex-start', 
        padding: 5,
    },
    container3: {
        backgroundColor: '#fff',
        flex: 1,  
    },
    containerText: {
        alignItems: 'flex-start', // if you want to fill rows left to right
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 1,
    },
    containerSearch: {
        alignItems: 'center',
        backgroundColor: '#fff',     
        marginHorizontal: 1,
        marginVertical: 1, 
        flexDirection: 'row',       
        padding: 1, 
    },   
    item: {
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 5,
        marginVertical: 6,
        marginHorizontal: 6,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 5,
        shadowOpacity: 0.28,        
        padding: 7,   
    },
    item2: {
        backgroundColor: '#E86267',
        borderRadius: 4,
        elevation: 5,
        marginVertical: 6,
        marginHorizontal: 6,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2},
        shadowRadius: 5,
        shadowOpacity: 0.28,        
        padding: 7,   
    },
    title: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
    },
    title2: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
    title3: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'justify',
    },
    title4: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 8,
        padding: 2,
    },
    title5: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'normal',
    },
    subTitle: {
        color: '#323131',
        fontSize: 13,
        fontWeight: 'bold',
    },
    subTitleSpace: {
        color: '#323131',
        fontSize: 14,
        fontWeight: 'bold',   
        marginLeft: 20,
    },
    text: {
        color: 'black',
        fontSize: 14,
        fontWeight: 'normal',
    },
    checkboxLabel: {
        width: '66%', 
        paddingVertical: 16, 
        paddingHorizontal: 1,
    },
    textInput: {
        backgroundColor: '#fff', 
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 35,       
        marginBottom: 2,
        marginTop: 2,  
        padding: 8,        
    }, 
    textInput2: {
        backgroundColor: '#fff', 
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 56,       
        marginBottom: 2,
        marginTop: 2,
        padding: 8,   
    },
    textInput3: {
        backgroundColor: '#fff', 
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 56,       
        marginBottom: 2,
        marginTop: 2,
        padding: 8,   
        width: 350     
    },
    textInputPayment: {
        backgroundColor: '#fff', 
        borderColor: '#ccc',
        borderRadius: 4,
        borderWidth: 1,
        color: 'black',
        fontSize: 16,
        height: 35,       
        marginBottom: 2,
        marginTop: 2,  
        padding: 8,  
        width: 220       
    }, 
    badge: {
        alignItems: 'flex-end',
        padding: 2, 
        position: 'absolute', 
        right: 1, 
        width: '55%'
    },
    inputField: {
        color: '#403c3c',
        fontSize: 16,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 2,
    },
    inputField2: {
        color: '#403c3c',
        fontSize: 16,
        borderBottomColor: 'white',
        borderBottomWidth: 1,
    },
    button: {
        backgroundColor: '#2a5c99',   
        borderRadius: 4,
        height: 40,
        marginVertical: 10,        
        paddingVertical: 10,
        padding: 10,
    },
    buttonText: {        
        color: "#ffffff",
        fontSize: 14,
        fontWeight: 'bold',  
        textAlign: "center",
    },
    buttonContainer: {
       marginBottom: 8,
       marginTop: 8, 
       paddingHorizontal: 8,
    },
    imageContainer: {  
        marginBottom: 4,       
        height: 200,  
        width: 320, 
    }, 
    imageView: {         
        height: '100%',
        marginTop: 3,
        resizeMode: 'stretch',
        width: '100%',
    },
    containerImage: { 
        height: 160,
        width: 320,
        marginVertical: 1,
    }, 
    header: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600'
    },
    headerButton: { 
        display: 'flex', 
        flexDirection: 'row',
        marginRight: 20,
    },
    headerButtonLeft: { 
        display: 'flex', 
        flexDirection: 'row',
        marginLeft: 20,
    },
    resultados: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 4,
        width: '98%',
    }
});

export const tableStyle = StyleSheet.create({ 
    tableColumn: {
      alignItems: "center",
      backgroundColor: "#ededed",
      flex: 2,
      justifyContent: "center",
      margin: 1,
    },
    tableColumn2: {
        backgroundColor: "#ededed",
        flex: 2,
        justifyContent: "center",
        margin: 1,
    },
    tableColumn3: {
        backgroundColor: "#ededed",
        flex: 2,
        margin: 1,
    },
    tableColumnHeader: {
      alignItems: "center",
      backgroundColor: colors.backgroundColor4,
      flex: 2,
      justifyContent: "center",
      margin: 1,
    },
    tableColumnHeader2: {
        backgroundColor: colors.backgroundColor4,
        flex: 2,
        margin: 1,
    },
    tableRow: {
      flexDirection: "row",
      maxHeight: 40,
    },
    tableRow2: {
        flexDirection: "row",
        height: 30,
    },
    textLineItemHeader: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold", 
    },
    textLineItemHeader2: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold", 
        marginLeft: 4,
    },
    textLineItem: {
      color: "#403c3c",
      fontSize: 14,
      marginLeft: 2,
    },
    textLineItem2: {
        color: "#403c3c",
        fontSize: 15,
    },
    textLineItem3: {
        color: "#403c3c",
        fontSize: 11,
        marginLeft: 2,
        textAlign: 'left',
    },
    textLineItem4: {
        color: "#403c3c",
        fontSize: 11,
    },
  });

export const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 14,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 0.5,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30 // to ensure the text is never behind the icon
    }
});