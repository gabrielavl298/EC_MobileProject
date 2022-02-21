import React, {useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createDrawerNavigator} from '@react-navigation/drawer';

import DrawerContent from '../components/DrawerContent';

import Themes from '../constants/Themes';

import HomeStack from './HomeStack';
import CheckoutStack from './CheckoutStack';
import LoginStack from './LoginStack';
import { withTheme } from 'react-native-elements';

//Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

//Utils
import { authActionTypes } from '../utils/Reducer';
import { useStateValue } from '../utils/StateProvider';

const Drawer = createDrawerNavigator();

const DrawerNav = () => {

    const [{user}, dispatch] = useStateValue();

    const auth = getAuth();

    /*
    onAuthStateChanged(auth, (user) => {
            if (user) {
            const uid = user.uid;
            dispatch({
                type: authActionTypes.AUTH_USER,
                user: {
                    userID: uid
                }
            });

            // ...
            } else {
                dispatch({
                    type: authActionTypes.LOGOUT_USER,
                });
            }
        });
    */
    useEffect(() => {
      return () => {
      }
    }, [user])
    

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
            
            { user.auth ? null :
                (
                    <Drawer.Screen name="LoginStack" component={LoginStack}
                        options={{
                            headerShown: false,
                            drawerItemStyle: {height: 0}
                        }}
                    />
                )
            }
            

        </Drawer.Navigator>
    )
}

export default DrawerNav

const styles = StyleSheet.create({
    
})