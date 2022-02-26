import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Modal, Pressable} from 'react-native'
import { 
    Avatar,
    ListItem } from 'react-native-elements';

//Constants
import Themes from '../../constants/Themes'

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
    const [modal, setModal] = useState({visible: false, productData: {}});

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
            <ListItem bottomDivider 
            onPress={() =>  {
                console.log("item for modal", item);
                setModal({visible: true, productData: item})
            }}>
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
      )}

        <Modal
            animationType="slide"
            transparent={true}
            visible={modal.visible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModal({visible: !modal.visible, productData: {}});
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{modal.visible ? modal.productData.productData.name : ""}</Text>
                    <Text style={styles.modalText}>{modal.visible ? (modal.productData.time) : ""}</Text>
                    <Text style={styles.modalText}>{modal.visible ? ("Cantidad: " + modal.productData.quantity) : ""}</Text>
                    <Text style={styles.modalText}>{modal.visible ? ("Total: $" + modal.productData.total) : ""}</Text>

                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModal({visible: !modal.visible, productData: {}})}
                    >
                        <Text style={styles.textStyle}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: Themes.COLORS.ERROR,
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})