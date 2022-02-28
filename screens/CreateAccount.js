import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView  } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button} from 'react-native-elements'

import Themes from '../constants/Themes'
import { color } from 'react-native-elements/dist/helpers';

//Firebase
import { auth, db } from '../config/cFirebase';
import { createUserWithEmailAndPassword, updateProfile  } from "firebase/auth";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

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

    const [emailError, setEmailError] = useState(false);
    const [emailErrorString, setEmailErrorString] = useState("")
    const [notFoundError, setNotFoundError] = useState(false);
    
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);



    /*  */
    async function RegisterUser(){
        setEmailError(false);
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
            let newUser = new UserAccount(username, phone, email);
            //console.log(newUser.account);
            WriteInDB(newUser.account, userID);

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
            
            switch(errorCode){
                case "auth/invalid-email":
                    setEmailError(true);
                    setEmailErrorString("Email address invalid");
                    
                    break;
                case "auth/email-already-in-use":
                    setEmailError(true);
                    setEmailErrorString("This email is already in use");
            }
        });
    }

    async function WriteInDB(userData, id){
        try {
            //const docRef = await addDoc(collection(db, "cuentas"), userData);
            const docRef = await setDoc(doc(db, "cuentas", id), userData);
            
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    function WritePassword(text){
        setPassword(text);
        //console.log(text <= 7 ? text +": " + true : text +": "  + false)
        setPasswordError(text.length <= 7 ? true : false);
        ConfirmPassword(text);
    }
    function ConfirmPassword(text){
        if(text == password){
            setConfirmPasswordError(false);
        }else{
            setConfirmPasswordError(true);
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
                            errorMessage = {emailError ? emailErrorString : ""}
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
                            onChange = {(e) => WritePassword(e.nativeEvent.text)}
                            errorMessage = {passwordError ? "Password too short" : ""}
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
                            onChange = {(e) => ConfirmPassword(e.nativeEvent.text)}
                            errorMessage = {confirmPasswordError ? "Passwords doesn't match" : ""} 
                        />
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width:'70%'}}>
                            <Button
                                title = 'Sign up'
                                buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY}}
                                onPress={() => RegisterUser()}
                                disabled = {(username.length == 0 || phone.length == 0 ||
                                    email.length == 0 || passwordError || confirmPasswordError  )}
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