import React, {useEffect, useState} from 'react'
import { StyleSheet, View, Image, ScrollView, Alert, FlatList } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, Input, Button, Text, ListItem, Avatar} from 'react-native-elements'

import Themes from '../constants/Themes'

//Utils
import { useStateValue } from '../utils/StateProvider';

const CartScreen = () => {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

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

    useEffect(() => {
        //getMovies();
        console.log("Basket data:", basket);
    }, []);


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
                    <ListItem.Subtitle>Subtotal: ${item.precio}</ListItem.Subtitle>
                </View>
                <View style = {{flex:2}}>
                    <View style = {{flex:1,  flexDirection:'row', alignItems:'center', justifyContent: 'center'}}>
                        <View style = {{flex:1, alignItems:'flex-end'}}>
                            <Button 
                                title= '<'
                                buttonStyle= {{width: '50%', backgroundColor: Themes.COLORS.PRIMARY}}
                            />
                        </View>
                        <View style = {{flex:1}}>
                            <Input
                                inputStyle = {{textAlign: 'center'}}
                                inputContainerStyle = {{width: '100%'}}
                                value = '1'
                            /> 
                        </View>
                        <View style = {{flex:1}}>
                            <Button 
                                title= '>'
                                buttonStyle= {{width: '50%', backgroundColor: Themes.COLORS.PRIMARY}}
                            />
                        </View>
                    </View>
                    <View style = {{flex:1, alignItems:'center', justifyContent: 'center'}}>
                        <View>
                            <Button 
                                icon = {{
                                    name: 'trash',
                                    type: 'font-awesome',
                                    size: 15,
                                    color: 'white',
                                }}
                                buttonStyle= {{backgroundColor: Themes.COLORS.ERROR}}
                            />
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
                    <Text style= {{ fontSize: 20}}> TOTAL: <Text style={{color: Themes.COLORS.SUCCESS}}>$ </Text></Text>
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
