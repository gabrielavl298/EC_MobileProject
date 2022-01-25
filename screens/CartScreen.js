import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Image, ScrollView, Alert, FlatList, Switch } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button, Text, ListItem, Avatar} from 'react-native-elements'

import Themes from '../constants/Themes'

//Utils
import { useStateValue } from '../utils/StateProvider';
import { actionTypes } from '../utils/Reducer';

const CartScreen = () => {
    const [isLoading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const [{basket}, dispatch] = useStateValue();

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

    const removeItem = (id) => dispatch({
        type: actionTypes.REMOVE_FROM_BASKET,
        id: id
    })

    const addOne = (id) => dispatch({
        type: actionTypes.ADD_ONE_TO_BASKET,
        id: id
    })

    const quitOne = (id) => dispatch({
        type: actionTypes.REMOVE_ONE_TO_BASKET,
        id: id
    })

    const setQuantity = (id, quantity) => {
        console.log("quantity:", quantity);
        dispatch({
        type: actionTypes.SET_QUANTITY_TO_BASKET,
        id: id,
        cantidad: quantity
    })}

    const setEnable = (id, enable) => {
        //setIsEnabled(previousState => !previousState);
        dispatch({
            type: actionTypes.SET_ENABLE_TO_BASKET,
            id: id,
            habilitado: enable
        })
    }

    useEffect(() => {
        let total = 0;
        basket.forEach(product => {
            if(product.habilitado) total += product.precio * product.cantidad;
        });

        setTotal(total);
      return () => {
          //Clean up
      };
    }, [basket]);
    


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
                                onPress={() => quitOne(item.id)}
                            />
                        </View>
                        <View style = {{flex:1}}>
                            <Input
                                inputStyle = {{textAlign: 'center'}}
                                inputContainerStyle = {{width: '100%'}}
                                value = {String(item.cantidad)}
                                onChange = {(e) => setQuantity(item.id, (e.nativeEvent.text).replace(/[^0-9]/g, ''))}
                                keyboardType='numeric'
                                onEndEditing = {(e) => {
                                    if(e.nativeEvent.text.length == 0) setQuantity(item.id, 1)
                                }}

                            /> 
                        </View>
                        <View style = {{flex:1}}>
                            <Button 
                                title= '>'
                                buttonStyle= {{width: '50%', backgroundColor: Themes.COLORS.PRIMARY}}
                                onPress={() => addOne(item.id)}
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
                                    onPress={() => removeItem(item.id)}
                                />
                           </View>
                        </View>
                        <View style = {{flex:1}}>
                            <View style = {{alignSelf: 'center'}}>
                                <Switch
                                    trackColor={{ false: Themes.COLORS.SWITCH_OFF_TRACK, true: Themes.COLORS.SWITCH_ON_TRACK}}
                                    thumbColor={item.habilitado ? Themes.COLORS.SWITCH_ON_THUMB : Themes.COLORS.SWITCH_OFF_THUMB}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={(e) => setEnable(item.id, e)}
                                    value = {item.habilitado}
                                />
                            </View>
                        </View>
                    </View>
                    
                </View>
            </ListItem.Content>
        </ListItem>
    )

    return (
        <View style={styles.container}>
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

                    />
                </View>
            </View>
        </View>
    )
}

export default CartScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:10
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
