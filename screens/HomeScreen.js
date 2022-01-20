import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View,
    ImageBackground, FlatList, Animated 
} from 'react-native'
import { Card, Button  } from 'react-native-elements';

//R-Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from '../config/cFirebase'

import Themes from '../constants/Themes';

export default function HomeScreen({navigation}) {

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [scrollViewWidth, setScrollViewWidth] = React.useState(0);

    const boxWidth = scrollViewWidth * 0.8;
    const boxDistance = scrollViewWidth - boxWidth;
    const halfBoxDistance = boxDistance / 2;
    const pan = React.useRef(new Animated.ValueXY()).current;

    const getMovies = async () => {
        /*try {
        const response = await fetch('https://reactnative.dev/movies.json');
        const json = await response.json();
        setData(json.movies);
        } catch (error) {
        console.error(error);
        } finally {
        
        setLoading(false);
        }*/
    }

    //Products from firebase
    const getProducts = async () => {
        let data = [];
        const querySnapshot = await getDocs(collection(db, "productoInfo"));
        querySnapshot.forEach((doc) => {
            let product = {
                id: doc.id,
                data: doc.data()
            }
        //console.log(`${doc.id} => ${doc.data()}`);
        data.push(product);
        });
        //console.log("Data[0]", data[0]);
        setData(data);
    }

    useEffect(() => {
        getProducts();
        return () => {
            console.log("clean up");
        }
    }, [])

    const renderItem = ({ item, index }) => (
        <Animated.View
          style={{
            transform: [
              {
                scale: pan.x.interpolate({
                  inputRange: [
                    (index - 1) * boxWidth - halfBoxDistance,
                    index * boxWidth - halfBoxDistance,
                    (index + 1) * boxWidth - halfBoxDistance, // adjust positioning
                  ],
                  outputRange: [0.8, 1, 0.8], // scale down when out of scope
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <View
            style={{
                        height: '100%',
                borderRadius: 24,
                backgroundColor: Themes.COLORS.DEFAULT,
                flex: 1,
                width: boxWidth
            }}>
            <View style = {styles.carouselItemContent}>
                <View style={{flex: 1}}>
                    <ImageBackground
                        source={{ uri: "https://rukminim1.flixcart.com/image/1408/1408/sunglass/r/a/p/0rb3025il9797-rayban-58-original-imadqb2ny5chn6hc.jpeg?q=90" }}
                        style={{ width: '100%', height: '98%',flex: 1}}
                    >
                       <View style= {{flex:1 ,alignSelf:'flex-end', width: '60%', backgroundColor: Themes.COLORS.SECONDARY, opacity: .9}}>
                        <Card
                                containerStyle={{opacity: 1, height: '90%', backgroundColor: Themes.COLORS.DEFAULT}}
                            >
                                <Card.Divider
                                    orientation = "vertical"
                                />
                                <Card.Title>{item.data.nombre}</Card.Title>
                                <Card.Divider/>
                                    <Button
                                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor: Themes.COLORS.PRIMARY}}
                                    title='VIEW NOW' 
                                    onPress = {() => {navigation.navigate('ProductScreen', 
                                        {pData: item}
                                    )}}
                                    />
                            </Card>
                       </View>
                    </ImageBackground>
                    
                </View>
            </View>
          </View>
        </Animated.View>
      );

    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <View>
                    <FlatList
                        horizontal
                        data={data}
                        style={{ backgroundColor: Themes.COLORS.PRIMARY, height: 275 }}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        contentInsetAdjustmentBehavior="never"
                        snapToAlignment="center"
                        decelerationRate="fast"
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={1}

                        snapToInterval={boxWidth}
                        contentInset={{
                            left: halfBoxDistance,
                            right: halfBoxDistance,
                        }}
                        contentOffset={{ x: halfBoxDistance * -1, y: 0 }}
                        onLayout={(e) => {
                            setScrollViewWidth(e.nativeEvent.layout.width);
                        }}

                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: pan.x } } }],
                            {
                            useNativeDriver: false,
                            },
                        )}
                        keyExtractor={(item, index) => `${index}-${item}`}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: Themes.COLORS.DEFAULT
    },
    carouselItemContent:{
        width: "90%",
        height: "100%",
        flexDirection: "row",
        alignContent: 'center',
        alignItems : "center",
        alignSelf:'center',

    }
})
