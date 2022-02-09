import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator} from '@react-navigation/drawer';

import DrawerContent from '../components/DrawerContent';

import Themes from '../constants/Themes';

import HomeStack from './HomeStack';
import CheckoutStack from './CheckoutStack';
import LoginStack from './LoginStack';
import { withTheme } from 'react-native-elements';

const Drawer = createDrawerNavigator();

const DrawerNav = () => {
    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props}/> }
            screenOptions={{
                drawerStyle: {
                backgroundColor: Themes.COLORS.SECONDARY,
                width: 240,
                },
            }}
        >
            <Drawer.Screen name="HomeStack" component={HomeStack}  
                options={{
                    title: 'Home', 
                    drawerLabel: 'Home',
                    drawerActiveTintColor: Themes.COLORS.DRAWER.SELECT_TXT,
                    drawerActiveBackgroundColor: Themes.COLORS.DRAWER.SELECT_BG
                }} 
            />
            <Drawer.Screen name="CheckoutStack" component={CheckoutStack}  
                options={{
                    title: 'My Cart',
                    headerShown: false,
                    drawerActiveTintColor: Themes.COLORS.DRAWER.SELECT_TXT,
                    drawerActiveBackgroundColor: Themes.COLORS.DRAWER.SELECT_BG
                    }}
            />
            
            <Drawer.Screen name="LoginStack" component={LoginStack}
                options={{
                    headerShown: false,
                    drawerItemStyle: {height: 0}
                }}
            />

        </Drawer.Navigator>
    )
}

export default DrawerNav

const styles = StyleSheet.create({
    
})