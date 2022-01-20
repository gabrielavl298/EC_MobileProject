import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

//React navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Screens
import HomeScreen from '../screens/HomeScreen'
import ProductViewScreen from '../screens/ProductViewScreen';

const Stack = createNativeStackNavigator();
export default function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Home'}}/>
            <Stack.Screen name="ProductScreen" component={ProductViewScreen} options = {{title: 'Product Info'}}/>
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create({})
