import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator} from 'react-native'
import { 
    Avatar,
    ListItem } from 'react-native-elements';

//Utils
import { useStateValue } from '../../utils/StateProvider';
import { orderActionTypes } from '../../utils/Reducer';

//Firebase
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/cFirebase';


export default function OrderListScreen({navigation}) {
    const [{user}, dispatchUser] = useStateValue();
    const [{localOrders}, dispatchOrder] = useStateValue();

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if(user.auth){
            setIsLoading(true);
            getOrders();
        }
        
        return () => {
            
        }
    }, [user])

    useEffect(() => {
        console.log("current orders: ", localOrders)
      return () => {
        
      }
    }, [localOrders])
    
    
    

    const getOrders = async () => {
        let data = [];
        const querySnapshot = await getDocs(collection(db, "cuentas", user.userID, "ordenes"));
        querySnapshot.forEach((doc) => data.push(doc.data()));

        dispatchOrder({
            type: orderActionTypes.CLONE_ORDER_LIST_FROM_DB,
            array: data
          })

        //console.log("Data[0]", data[0]);
        setIsLoading(false);
        //console.log("The orders", orders);
    }

    /*async function getOrderData (pID) {
        let  docSnapshot = await getDoc(doc(db, "productoInfo", pID));
        if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        return docSnapshot.data();
    }*/

    /*
    <ListItem bottomDivider>
            <Avatar source={{
                uri: "https://rukminim1.flixcart.com/image/1408/1408/sunglass/r/a/p/0rb3025il9797-rayban-58-original-imadqb2ny5chn6hc.jpeg?q=90"
                }}/>
                size = 'medium'
            <ListItem.Content>
                <ListItem.Title>{item.productID}</ListItem.Title>
                <ListItem.Subtitle>{item.time}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem> */

    const renderOrderList = ({ item, index }) => (
         <View>
            <ListItem bottomDivider>
                <Avatar source={{
                    uri: "https://rukminim1.flixcart.com/image/1408/1408/sunglass/r/a/p/0rb3025il9797-rayban-58-original-imadqb2ny5chn6hc.jpeg?q=90"
                    }} 
                    size = 'medium'
                />
                <ListItem.Content>
                    <ListItem.Title>{item.productData.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.time}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
         </View>
    );

  return (
    <View>
      <Text>OrderListScreen</Text>
      {isLoading ? <ActivityIndicator/> : (
        <View>
            <FlatList
            data={localOrders}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderOrderList}
            />
        </View>
      ) 
      
    }
    </View>
  )
}

const styles = StyleSheet.create({})