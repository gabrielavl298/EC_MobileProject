import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView  } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button} from 'react-native-elements'

import Themes from '../constants/Themes'
import { color } from 'react-native-elements/dist/helpers';

//Firebase
import { auth, db } from '../config/cFirebase';
import { createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

//Models
import {UserAccount} from "../models/UserAccountModel"

//Utils
import { authActionTypes } from '../utils/Reducer';
import { useStateValue } from '../utils/StateProvider';

const CreateAccount = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [username, setUsername] = useState('')
    const [phone, setPhone] = useState('')

    const [{user}, dispatch] = useStateValue();


    /*  */
    async function RegisterUser(){
        await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            
            //console.log("User credentials: ", userCredential.user)
            
            const userCreated = auth.currentUser;
            updateProfile(userCreated, {
                displayName: username
            });
            console.log("user just created: ", userCreated);

            let userID = userCredential.user.uid;
            let newUser = new UserAccount(username, phone, email, userID);
            //console.log(newUser.account);
            WriteInDB(newUser.account);

            dispatch({
                type: authActionTypes.AUTH_USER,
                user: {
                    userID: userID,
                    email: email,
                    username: username
                }
            });
            //console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);        
        });
    }

    async function WriteInDB(userData){
        try {
            const docRef = await addDoc(collection(db, "cuentas"), userData);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return (
        <ScrollView  style = {styles.container}>
            <View style= {{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
                <Image source= {require('../assets/images/icon.png')} style= {styles.logo}/>
            </View>
            <View style= {{flex: 2, alignItems: 'center', paddingTop: 5}}>
            <Text style={styles.titleTxt}>Create account</Text>
                <View style={{width: '85%'}}>
                    <View>
                        <Input placeholder = 'Username' 
                            color={Themes.COLORS.SECONDARY}
                            placeholderTextColor={Themes.COLORS.PLACEHOLDER1}
                            labelStyle= {{color:  Themes.COLORS.LABEL1}}
                            label = 'Your username'
                            leftIcon={ <Icon name='user' size={24} 
                                color= {Themes.COLORS.ICON1}
                            />}
                            autoCompleteType = 'off'
                            onChange = {(e) => setUsername(e.nativeEvent.text)}
                        />
                    </View>
                    <View>
                        <Input placeholder = '###-###-####' 
                            color={Themes.COLORS.SECONDARY}
                            placeholderTextColor={Themes.COLORS.PLACEHOLDER1}
                            labelStyle= {{color:  Themes.COLORS.LABEL1}}
                            label = 'Your phone number'
                            leftIcon={ <Icon name='phone' size={24} 
                                color= {Themes.COLORS.ICON1}
                            />}
                            autoCompleteType = 'off'
                            onChange = {(e) => setPhone(e.nativeEvent.text)}
                        />
                    </View>
                    <View>
                        <Input placeholder = 'email@address.com' 
                            color={Themes.COLORS.SECONDARY}
                            placeholderTextColor={Themes.COLORS.PLACEHOLDER1}
                            labelStyle= {{color:  Themes.COLORS.LABEL1}}
                            label = 'Your email address'
                            leftIcon={ <Icon name='at' size={24} 
                                color= {Themes.COLORS.ICON1}
                            />}
                            keyboardType = "email-address"
                            autoCompleteType = 'off'
                            value = {email}
                            onChange = {(e) => setEmail(e.nativeEvent.text)}
                        />
                    </View>
                    <View>
                        <Input placeholder = 'Password' 
                            color={Themes.COLORS.SECONDARY}
                            placeholderTextColor={Themes.COLORS.PLACEHOLDER1}
                            labelStyle= {{color:  Themes.COLORS.LABEL1}}
                            label = 'Your password'  
                            leftIcon={ <Icon name='key' size={24} 
                            color= {Themes.COLORS.ICON1}
                            />}
                            secureTextEntry={true}

                            value = {password}
                            onChange = {(e) => setPassword(e.nativeEvent.text)}
                        />
                        <Input placeholder = 'Confirm password' 
                            color={Themes.COLORS.SECONDARY}
                            placeholderTextColor={Themes.COLORS.PLACEHOLDER1}
                            labelStyle= {{color:  Themes.COLORS.LABEL1}}
                            label = 'Confirm your password'  
                            leftIcon={ <Icon name='key' size={24} 
                            color= {Themes.COLORS.ICON1}
                            />}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width:'70%'}}>
                            <Button
                                title = 'Sign up'
                                buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY}}
                                onPress={() => RegisterUser()}
                            />
                        </View>
                    </View>
                    <View style= {{paddingTop: 5, alignItems: 'center'}}>
                        <Text style={styles.textStyle}> Already have an account?  <Text style={styles.linkText} onPress={() => {navigation.navigate('Login')}}>log in here</Text></Text>
                    </View>
                    <View style={{height:30}} /> 
                </View>
            </View>
        </ScrollView >
    )
}

export default CreateAccount

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: Themes.COLORS.DEFAULT,
        paddingTop: 10
        
    },
    logo:{
        width: '65%',
        height: '61.5%',
        paddingTop: '50%'
    },
    titleTxt:{
        fontSize: Themes.SIZES.TEXT.TITLE,
        color: Themes.COLORS.PRIMARY,
        fontWeight: 'bold'
    },
    textStyle:{
        color: Themes.COLORS.SECONDARY
    },
    linkText:{
        color: Themes.COLORS.SECONDARY,
        textDecorationLine: 'underline'
    }
})