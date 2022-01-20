import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator} from '@react-navigation/drawer';

import DrawerContent from '../components/DrawerContent';

import Themes from '../constants/Themes';

import HomeStack from './HomeStack';
import CheckoutStack from './CheckoutStack';

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
    return (
        <Drawer.Navigator drawerContent={props => <DrawerContent {...props}/> }
            screenOptions={{
                drawerStyle: {
                backgroundColor: Themes.COLORS.PRIMARY,
                width: 240,
                },
            }}
        >
            <Drawer.Screen name="HomeStack" component={HomeStack}  
                options={{
                    title: 'Home', 
                    drawerLabel: 'Home',
                    
                }} 
            />
            <Drawer.Screen name="CheckoutStack" component={CheckoutStack}  
                options={{
                    title: 'My Cart',
                    headerShown: false
                    }}
            />
            
        </Drawer.Navigator>
    )
}

export default DrawerNav

const styles = StyleSheet.create({})