import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Image, ScrollView, Alert, FlatList, Switch, ActivityIndicator } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button, Text, ListItem, Avatar} from 'react-native-elements'

import Themes from '../constants/Themes'

//Firebase
import { collection, setDoc, doc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/cFirebase';

//Utils
import { useStateValue } from '../utils/StateProvider';
import { actionTypes } from '../utils/Reducer';
import { item } from '../models/CheckoutModels';

const CartScreen = ({navigation}) => {
    const [isLoading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [{basket}, dispatch] = useStateValue([]);
    const [{user}, dispatchUser] = useStateValue({});
    const [enProducts, setEnProducts] = useState([]);

    const getMovies = async () => {
        try {
        const response = await fetch('https://reactnative.dev/movies.json');
        const json = await response.json();
        setData(json.movies);
        } catch (error) {
        console.error(error);
        } finally {
        setLoading(false);
        }
    }

    const removeItem = async(id) => {
        let saved = await DeleteFromDataBase(id);
        if(saved){
            dispatch({
                type: actionTypes.REMOVE_FROM_BASKET,
                id: id
            })
        }else{
            Alert.alert(
                "Ups",
                "Something were wrong, sorry :c. \n Try again later",
                [
                    //{ text: "OK", onPress: () => navigation.navigate('HomeScreen')}
                    { text: "OK"}
                ]
            );
        }
    }
    

    const addOne = async (id) => {
        let saved = await SaveOnDataBase(id, 1, undefined);
        if(saved){
            dispatch({
                type: actionTypes.ADD_ONE_TO_BASKET,
                id: id
            });
        }else{
            Alert.alert(
                "Ups",
                "Something were wrong, sorry :c. \n Try again later",
                [
                    //{ text: "OK", onPress: () => navigation.navigate('HomeScreen')}
                    { text: "OK"}
                ]
            );
        }
    }

    const quitOne = async (id) => {
        //console.log("The id from cart screen (78) ", id)
        let saved = await SaveOnDataBase(id, -1, undefined);
        if(saved){
            dispatch({
                type: actionTypes.REMOVE_ONE_TO_BASKET,
                id: id
            });
        }else{
            Alert.alert(
                "Ups",
                "Something were wrong, sorry :c. \n Try again later",
                [
                    //{ text: "OK", onPress: () => navigation.navigate('HomeScreen')}
                    { text: "OK"}
                ]
            );
        }
    }

    const setQuantity = async (id, quantity) => {
        let quantityInt = parseInt(quantity);
        console.log(quantity);
        let saved = await SaveOnDataBase(id, quantityInt, undefined, true);
        if(saved){
            dispatch({
                type: actionTypes.SET_QUANTITY_TO_BASKET,
                id: id,
                cantidad: quantity
            });
        }else{
            Alert.alert(
                "Ups",
                "Something were wrong, sorry :c. \n Try again later",
                [
                    //{ text: "OK", onPress: () => navigation.navigate('HomeScreen')}
                    { text: "OK"}
                ]
            );
        }
    }   

    const setEnable = async (id, enable) => {
        let saved = await SaveOnDataBase(id, 0, enable, undefined, true);
        if(saved){
            dispatch({
                type: actionTypes.SET_ENABLE_TO_BASKET,
                id: id,
                habilitado: enable
            })
        }else{
            Alert.alert(
                "Ups",
                "Something were wrong, sorry :c. \n Try again later",
                [
                    //{ text: "OK", onPress: () => navigation.navigate('HomeScreen')}
                    { text: "OK"}
                ]
            );
        }
        
    }

    useEffect(() => {
        let enabledProducts = [];
        let total = 0;
        basket.forEach(product => {
            if(product.habilitado){
                total += product.precio * product.cantidad;
                enabledProducts.push(product);
            } 
        });
        setEnProducts(enabledProducts);
        //console.log("new object variable: ", enProducts)
        
        setTotal(total);
      return () => {
          //Clean up
      };
    }, [basket]);

    useEffect(() => {
      if(user.auth){
        setLoading(false);
         getCart()
      }
    
      return () => {
        
      }
    }, [user])
    
    async function SaveOnDataBase(id, add, changeEnable, manualAdd = false, manualEnable = false){
        let saved = false;
        //console.log("current basket", basket);
        let index = basket.findIndex(basketItem => basketItem.id === id);
        let itemToSave = {...basket[index]}
        itemToSave.cantidad = manualAdd ? add : itemToSave.cantidad + add;
        itemToSave.habilitado = manualEnable ? changeEnable : itemToSave.habilitado;
        delete itemToSave.id;
        console.log("Item to save:", itemToSave);
        console.log("Index:", index);

        try {
            //let docRef = await addDoc(collection(db, "cuentas"), item);
            let newItem = doc(db, "cuentas", user.userID, "carrito", id);
    
            await setDoc(newItem, itemToSave);
            //console.log("Document written with ID: ", docRef.id);
            saved = true;
        } catch (e) {
            console.error("Error adding document: ", e);
            saved = false;
        }

        return saved;
      }

      async function DeleteFromDataBase(id){
        let saved = false;
        try {
          //let docRef = await addDoc(collection(db, "cuentas"), item);
          let itemToDelete = doc(db, "cuentas", user.userID, "carrito", id);
          await deleteDoc(itemToDelete);
          saved = true;
          //console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        return saved;
      }

      const getCart = async () => {
          console.log("user id from cart screen:", user.userID);
        let data = [];
        const querySnapshot = await getDocs(collection(db, "cuentas", user.userID, "carrito"));
        querySnapshot.forEach((doc, i = 0) => {
            data.push(doc.data());
            data[i].id = doc.id;

            i++;
        });

        dispatch({
            type: actionTypes.CLONE_BASKET_FROM_DB,
            array: data
          })

          //console.log("Basket from cart screen (219)",basket);

        //console.log("Data[0]", data[0]);
        setLoading(false);
        //console.log("The orders", orders);
    }


    const cartItem = ({ item, index }) => (
        <ListItem bottomDivider>
            <Avatar source={{
                uri: "https://rukminim1.flixcart.com/image/1408/1408/sunglass/r/a/p/0rb3025il9797-rayban-58-original-imadqb2ny5chn6hc.jpeg?q=90"
                }} 
                size = 'medium'
            />
            <ListItem.Content style={{flexDirection: 'row'}} >
                <View style={{flex:1}}>
                    <ListItem.Title>{item.titulo}</ListItem.Title>
                    <ListItem.Subtitle>Subtotal: ${item.precio * item.cantidad}</ListItem.Subtitle>
                </View>
                <View style = {{flex:2}}>
                    <View style = {{flex:1,  flexDirection:'row', alignItems:'center', justifyContent: 'center'}}>
                        <View style = {{flex:1, alignItems:'flex-end'}}>
                            <Button 
                                title= '<'
                                buttonStyle= {{width: '50%', backgroundColor: Themes.COLORS.PRIMARY}}
                                onPress={async() => quitOne(item.id)}
                            />
                        </View>
                        <View style = {{flex:1}}>
                            <Input
                                inputStyle = {{textAlign: 'center'}}
                                inputContainerStyle = {{width: '100%'}}
                                value = {String(item.cantidad)}
                                onChange = {async(e) => setQuantity(item.id, (e.nativeEvent.text).replace(/[^0-9]/g, ''))}
                                keyboardType='numeric'
                                onEndEditing = {async(e) => {
                                    if(e.nativeEvent.text.length == 0 || e.nativeEvent.text == "0") setQuantity(item.id, 1)
                                }}

                            /> 
                        </View>
                        <View style = {{flex:1}}>
                            <Button 
                                title= '>'
                                buttonStyle= {{width: '50%', backgroundColor: Themes.COLORS.PRIMARY}}
                                onPress={async() => addOne(item.id)}
                            />
                        </View>
                    </View>
                    <View style = {{flex:1, flexDirection:'row', alignItems:'center', justifyContent: 'center'}}>
                        <View style = {{flex:1}}>
                           <View style = {{width: '50%', alignSelf: 'center'}}>
                                <Button 
                                    icon = {{
                                        name: 'trash',
                                        type: 'font-awesome',
                                        size: 15,
                                        color: 'white',
                                    }}
                                    buttonStyle= {{backgroundColor: Themes.COLORS.ERROR}}
                                    onPress={async() => removeItem(item.id)}
                                />
                           </View>
                        </View>
                        <View style = {{flex:1}}>
                            <View style = {{alignSelf: 'center'}}>
                                <Switch
                                    trackColor={{ false: Themes.COLORS.SWITCH_OFF_TRACK, true: Themes.COLORS.SWITCH_ON_TRACK}}
                                    thumbColor={item.habilitado ? Themes.COLORS.SWITCH_ON_THUMB : Themes.COLORS.SWITCH_OFF_THUMB}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={async(e) => setEnable(item.id, e)}
                                    value = {item.habilitado}
                                />
                            </View>
                        </View>
                    </View>
                    
                </View>
            </ListItem.Content>
        </ListItem>
    )

    const cartView = ()  => (
        <View>
            <View style = {styles.cartListContainer}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                    data={basket}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={cartItem}
                />
                )}
            
            </View>
            <View style= {styles.bootomContainer}>
                <View style= {{flex:1, justifyContent:'center'}}>
                    <Text style= {{ fontSize: 20}}> TOTAL: <Text style={{color: Themes.COLORS.SUCCESS}}>$ {total}</Text></Text>
                </View>
                <View style= {{flex:1, justifyContent:'center'}}>
                    <Button 
                        title='Checkout >'
                        buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY}}
                        onPress = {() => navigation.navigate("CheckoutScreen", {items: enProducts, total: total})}
                    />
                </View>
            </View>
        </View>
    )

    return (
        <View style={styles.cartContainer}>
            {user.auth ? 
            <View>
                <View style = {styles.cartListContainer}>
                <FlatList
                        data={basket}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={cartItem}
                    />
                </View>
                <View style= {styles.bootomContainer}>
                    <View style= {{flex:1, justifyContent:'center'}}>
                        <Text style= {{ fontSize: 20}}> TOTAL: <Text style={{color: Themes.COLORS.SUCCESS}}>$ {total}</Text></Text>
                    </View>
                    <View style= {{flex:1, justifyContent:'center'}}>
                        <Button 
                            title='Checkout >'
                            buttonStyle = {{backgroundColor: Themes.COLORS.PRIMARY}}
                            onPress = {() => navigation.navigate("CheckoutScreen", {items: enProducts, total: total})}
                            disabled = {basket.length > 0 ? false : true}
                        />
                    </View>
                </View>
            </View>
            : 
            <View style = {styles.cartEmptyContainer}>
                <View>
                    <Text>Your cart is empty</Text>
                </View>
                <View>
                    <View>
                        <Button
                            title="Sign in"
                            icon={{
                                name: 'user',
                                type: 'font-awesome',
                                size: 15,
                                color: 'white',
                            }}
                            iconRight
                            iconContainerStyle={{ marginLeft: 10 }}
                            titleStyle={{ fontWeight: '700' }}
                            buttonStyle={{
                                backgroundColor: Themes.COLORS.PRIMARY,
                                borderColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 30,
                            }}
                            containerStyle={{
                                width: 200,
                                marginHorizontal: 50,
                                marginVertical: 10,
                            }}
                            onPress= {() => navigation.navigate('LoginStack', { screen: 'Login'})}
                        />
                    </View>

                    <View>
                        <Button
                            title="Sign up"
                            type='outline'
                            icon={{
                                name: 'user',
                                type: 'font-awesome',
                                size: 15,
                                color: 'white',
                            }}
                            iconRight
                            iconContainerStyle={{ marginLeft: 10 }}
                            titleStyle={{ fontWeight: '700', color: Themes.COLORS.PRIMARY}}
                            buttonStyle={{
                                borderColor: Themes.COLORS.PRIMARY,
                                borderWidth: 1,
                                borderRadius: 30,
                            }}
                            containerStyle={{
                                width: 200,
                                marginHorizontal: 50,
                                marginVertical: 10,
                            }}
                            onPress= {() => navigation.navigate('LoginStack', { screen: 'CreateAccount'})}
                        />
                    </View>
                </View>
            </View>
            }
            
        </View>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    cartContainer: {
        flex: 1,
        paddingTop:10
    },
    cartEmptyContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
        
    },
    cartListContainer:{

        backgroundColor:'blue'
    },
    bootomContainer:{
        width: '95%',
        height: 50,
        flexDirection:'row'
    }
})
