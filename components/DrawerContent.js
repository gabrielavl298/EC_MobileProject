import React from 'react'
import { StyleSheet, View } from 'react-native'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';

import {
    Avatar,
    Text
} from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome';

/*import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();*/

const DrawerContent = (props) => {

   function LogOut(){
         /*signOut(auth).then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          }); */         
    }
    return (
        <View style ={{flex:1}} >
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{flexDirection:'row',marginTop: 15}}>
                            <Avatar 
                                rounded
                                source={{
                                    uri: 'https://media.cdnandroid.com/5c/a2/66/b8/78/imagen-avatar-emoji-me-zmoji-0big.jpg'
                                }}
                                size='medium'
                            />
                            <View style={{marginLeft:15, flexDirection:'column'}}>
                                <Text style={styles.title}>Gabriela</Text>
                                <Text style={styles.caption}>@gaby12</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <DrawerItemList {...props} />
                <DrawerItem
                label ="Log out"
                icon = {() => <Icon name="sign-out"/>}
                onPress = {() => LogOut()}
            />
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
