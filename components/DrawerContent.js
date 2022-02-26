import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import {
    Avatar,
    Text,
    Button
} from 'react-native-elements'

import Themes from '../constants/Themes'

import Icon from 'react-native-vector-icons/FontAwesome';


//Utils
import { authActionTypes, orderActionTypes } from '../utils/Reducer';
import { useStateValue } from '../utils/StateProvider';

import { getAuth, signOut } from "firebase/auth";

const DrawerContent = (props) => {
  const authInstance = getAuth();

  const navigation = props.navigation;
  const [auth, isAuth] = useState(false);
  const [{user}, dispatch] = useStateValue();
  const [{localOrders}, dispatchOrder] = useStateValue();

  useEffect(() => {
    isAuth(user.auth)
    console.log("current user (from drawer content .js)", user)
    return () => {

    };
  }, [user]);
  

   function LogOut(){
         signOut(authInstance).then(() => {
            dispatch({
              type: authActionTypes.LOGOUT_USER,
            });
          }).catch((error) => {
            console.log("Sign out error: ",  error);
          });    
          dispatchOrder({
            type: orderActionTypes.DELETE_LOCAL_ORDER_LIST
          })     
    }

    const renderUser = () => (
      <View style={{flexDirection:'row',marginTop: 15}}>
        <Avatar 
          rounded
          source={{
            uri: 'https://media.cdnandroid.com/5c/a2/66/b8/78/imagen-avatar-emoji-me-zmoji-0big.jpg'
          }}
          size='medium'
        />
        
        <View style={{marginLeft:15, flexDirection:'column'}}>
          <Text style={styles.title}>{user.username}</Text>
          <Text style={styles.caption}>{user.email}</Text>
        </View>
      </View>
    );

    const renderUserGuest = () => (
      <View style={{flexDirection:'row',marginTop: 15}}>
        <Avatar 
          rounded
          icon={{ name: 'user', type: 'font-awesome' }}
          containerStyle={{ backgroundColor: Themes.COLORS.MUTED }}
          size='medium'
        />
        
        <View style={{marginLeft:15, flexDirection:'column'}}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>GUEST</Text>
          </View>

          <View style={{flex: 1, flexDirection: 'row', width: '80%'}}>
            <View style ={{paddingRight: 5}} >
              <Button
                type='clear'
                title='SIGN IN' 
                titleStyle={{ color: 'white', fontSize: 13, textDecorationLine: 'underline'}}
                onPress = {() => {props.navigation.navigate('LoginStack', { screen: 'Login'})}}
                />
            </View>
            <View>
              <Button
                type='outline'
                buttonStyle={{
                  borderColor: Themes.COLORS.PRIMARY,
                  borderRadius: 10,
                  borderWidth: 1
                }}
                title='SIGN UP' 
                titleStyle={{ color: 'white', fontSize: 13}}
                onPress = {() => {props.navigation.navigate('LoginStack', {screen: 'CreateAccount'})}}
                />
            </View>
          </View>
        </View>
      </View>
    );

    return (
        <View style ={{flex:1}} >
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        {
                          auth ? renderUser() : renderUserGuest()
                        }
                    </View>
                </View>
                <DrawerItemList {...props} />
                
                { auth ? 
                  (<DrawerItem
                    label ="Log out"
                    icon = {() => <Icon name="sign-out"/>}
                    onPress = {() => LogOut()}
                  />)
                  : null
                }
            </DrawerContentScrollView>
        </View>
    )
}

export default DrawerContent

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
      },
      userInfoSection: {
        paddingLeft: 20,
      },
      title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
      },
      caption: {
        fontSize: 14,
        lineHeight: 14,
      },
      drawerSection: {
        marginTop: 15,
      },
})
