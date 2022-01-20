import React from 'react'
import { StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator();

const CheckoutStack = () => {
    return (
        <Stack.Navigator initialRouteName='ProductScreen'>
            <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options = {{title: 'Order Info'}}/>
        </Stack.Navigator>
    )
}

export default CheckoutStack

const styles = StyleSheet.create({})