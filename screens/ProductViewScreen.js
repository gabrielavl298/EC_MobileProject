import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Image, ScrollView, Alert } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button, Text} from 'react-native-elements'

//R-Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Themes from '../constants/Themes'

const ProductViewScreen = ({navigation}) => {
    function AddToCart(){
        Alert.alert(
            "Product added!",
            "See your cart to view your products ;)",
            [
                { text: "OK", onPress: () => navigation.navigate('HomeScreen')}
            ]
        );
    }
    const [amorcito, setAmorcito] = useState(0)

    useEffect(() => {
        console.log("el valor de amorcito es:" + amorcito)
        return () => {
            
        }
    }, [amorcito])


    return (
        <View style = {styles.container}>
            <View style = {styles.productImageContainer}>
                <View style={styles.productImageBorder}>
                    <Image
                        source={{ uri: "https://rukminim1.flixcart.com/image/1408/1408/sunglass/r/a/p/0rb3025il9797-rayban-58-original-imadqb2ny5chn6hc.jpeg?q=90" }}
                        style={styles.productImageStyle}
                    />
                </View>
                
            </View>
            <View style= {styles.productDataContent}>
                <Text h1>AMORCITO {amorcito}</Text>
                <Text h2>PRODUCT PRICE</Text>
                <View style = {styles.productDescriptionContainer}>
                    <Text h3 style = {{fontSize: 10}} >Description</Text>
                    <ScrollView>
                        <Text style = {styles.productDescriptionTetx} >
                            Product information Product information Product information Product information Product information Product information
                            Product information Product information Product information Product information Product information Product information
                            Product information Product information Product information Product information Product information Product information
                        </Text>
                    </ScrollView>
                </View>
                <Button
                    title = 'ADD TO CART'
                    icon = {<Icon name='shopping-cart' size = {15} color='white' style = {{marginRight: 10}}/>}
                    buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY, marginTop: 20}}
                    onPress ={() => {AddToCart()}}
                />
                <Button
                    title = 'Aumentar en 1'
                    buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY, marginTop: 20}}
                    onPress ={() => {setAmorcito(amorcito+1);}}
                />
            </View>
        </View>
    )
}

export default ProductViewScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 20
    },
    productImageContainer: {
        flex:1,
        alignContent: 'center',
        justifyContent: 'center',
        alignItems:'center',
    },
    productImageBorder:{
        backgroundColor: Themes.COLORS.PRIMARY,
        width: '50%',
        height: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems:'center',
    },
    productImageStyle: {
        width: '90%', 
        height: '90%',
        opacity: .9
    },
    productDataContent:{
        flex: 2,
        paddingTop: 15,
        alignContent: 'center',
        alignItems:'center',
    },
    productDescriptionContainer:{
        width:'80%',
        height: 150,
        marginTop: 10,
    },
    productDescriptionTetx:{
        textAlign: 'justify'
    }
})
