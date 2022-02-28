import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button} from 'react-native-elements'

import Themes from '../constants/Themes'
import { color } from 'react-native-elements/dist/helpers';

//Firebase
import { auth, db } from '../config/cFirebase'
import {signInWithEmailAndPassword} from 'firebase/auth'
import { collection, getDoc, doc } from "firebase/firestore";
//import { ThemeProvider } from '@react-navigation/native';

//Utils
//Uitls
import { authActionTypes } from '../utils/Reducer';
import { useStateValue } from '../utils/StateProvider';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [notFoundError, setNotFoundError] = useState(false);

    const [notFoundErrorMessage, setNotFoundErrorMessage] = useState('');


    const [{user}, dispatch] = useStateValue();

    async function LogIn(){
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const userData = userCredential;
            //GetUserData(userData.user);
            console.log("User logged: ", userData);
            setEmailError(false);

            dispatch({
                type: authActionTypes.AUTH_USER,
                user: {
                    userID: userData.user.uid,
                    email: userData.user.email,
                    username: userData.user.displayName
                }
            });
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage + "\n" +errorCode);
            console.log("Error code: "+error.code);

            switch(error.code){
                case "auth/invalid-email":
                    setEmailError(true);
                    break;
                case "auth/wrong-password":
                    setNotFoundError(true);
                    setEmailError(false);
                case "auth/user-not-found":
                    setNotFoundError(true);
                    setEmailError(false);

            }
        });
    }    

    return (
        <ScrollView style = {styles.container}>
            <View style= {{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
                <Image source= {require('../assets/images/icon.png')} style= {styles.logo}/>
            </View>
            <View style= {{flex: 2, alignItems: 'center', paddingTop: 5}}>
                <Text style={styles.titleTxt}>Login</Text>
                <View style={{width: '85%'}}>
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
                            
                            inputContainerStyle={ emailError ? {borderColor: Themes.COLORS.ERROR} : {borderColor: Themes.COLORS.INPUT.BORDER}}
                            errorMessage= { emailError ? 'Email address invalid' : ''}
                            onChange= {(e) => {setEmail(e.nativeEvent.text)}}
                            value = {email}
                            renderErrorMessage = {true}
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
                            onChange = {(e) => {setPassword(e.nativeEvent.text)}}
                            value = {password}
                            
                            
                        />
                    </View>
                    <View style={{alignItems: 'center'}}>
                        {notFoundError ? (<View>
                            <Text style = {{color: Themes.COLORS.ERROR}}>Email or password are incorrect</Text>
                            </View>) : <View/>
                        }
                        <View style={{width:'70%', paddingTop:10}}>
                            <Button
                                title = 'Log in'
                                buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY}}
                                disabled = {password.length == 0 ? true : false}
                                onPress ={() => {LogIn()}}
                            />
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <View style={{width:'70%', paddingTop:10}}>
                            <Button
                                title = 'Log in with google'
                                buttonStyle = {{backgroundColor: Themes.COLORS.OTHER.GOOGLEBTN}}
                                icon = {<Icon name='google' size = {24} color='white' style={{marginRight:7}}/>}
                            />
                        </View>
                    </View>
                    <View style= {{paddingTop: 15, alignItems: 'center'}}>
                        <Text style={styles.textStyle}> New here?  <Text style={styles.linkText} onPress={() => {navigation.navigate('CreateAccount')}}>create an account</Text></Text>
                    </View>
                </View>
            </View>
            
        </ScrollView>
    );
}

export default LoginScreen

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
