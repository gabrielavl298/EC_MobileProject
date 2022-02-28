import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView } from 'react-native'
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';

import { item, purchaseUnit } from '../models/CheckoutModels'; 

//Firebase
import { db } from '../config/cFirebase';
import { collection, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

//Aux
import Themes from '../constants/Themes';

//Models
import { Order } from '../models/OrderModel';
import { Timestamp } from 'firebase/firestore';

//Utils
import { useStateValue } from '../utils/StateProvider';
import { actionTypes, orderActionTypes } from '../utils/Reducer';

const CheckoutScreen = (props) => {
    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [finalPurchase, setFinalPurchase] = useState({}) //Object for paypal
    const [itemsActive, setItemsActive] = useState([])

    const [{basket}, dispatchBasket] = useStateValue();
    const [{user}, dispatchUser] = useStateValue();
    const [{localOrders}, dispatchOrder] = useStateValue();

    let cartData = props.route.params;

    const url = "https://et-web-77045.web.app"

    /*const jsCode = `document.body.style.backgroundColor = 'red';
    setTimeout(function() { window.alert('hi') }, 2000);
    true;`;*/

      function injectedToHtml() {
      let injectedData = `document.getElementById('items').value = '${JSON.stringify(finalPurchase)}'
      let example = 0;
      true;`;
      //this.webViewApp.injectJavaScript(`SetOrderInfo(${finalPurchase})`)
      return injectedData;
     }

     const runFirst = `
      window.isNativeApp = true;
      true; // note: this is required, or you'll sometimes get silent failures
    `;
  

    useEffect(() => {
      let itemsForPaypal = [];
      let itemsActive = [];
      
      cartData.items.forEach(product => {
        let itemToBuy = new item(product.nombre, product.descripcion,
          product.precio, product.cantidad);
          
          let itemData = itemToBuy.itemData
          itemsForPaypal.push(itemData);

          itemData.id = product.id;
          itemsActive.push(itemData);
      });

      console.log("Items active:", itemsActive);
      setItemsActive(itemsActive);

      let newPurchaseUnit = new purchaseUnit(cartData.total, itemsForPaypal);
      setFinalPurchase(newPurchaseUnit.unit);
      //console.log("Compra a realizar let: ", finalPurchase);

      return () => {
        
      }
    }, [])

    function onMessage(e) {
        let data = e.nativeEvent.data;
        setShowGateway(false);
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
          SaveOrder();

          alert('PAYMENT MADE SUCCESSFULLY!');
        } else {
          alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
          console.log(payment.order)
        }
      }

      async function SaveOrder(){
        let date = Timestamp.now().toDate().toString().split(" ", 4)
        let dateString = "";

        for(let i = 0; i < date.length; i++){
          dateString+= i<date.length-1 ? (date[i] + "-") : (date[i]);
        }

        console.log("Items active (in save order):", itemsActive);
        itemsActive.forEach(item => {
          console.log("item in itemsActive",item);
          let newOrder = new Order(item, item.quantity, 
            dateString, item.quantity * item.unit_amount.value);

          console.log("Order created:", newOrder);

          SaveOnDataBase(newOrder.orderData);
          dispatchOrder({
            type: orderActionTypes.ADD_ORDER_TO_LIST,
            data: newOrder.orderData
          })

          DeleteFromDataBase(item.id);
          RemoveItemFromBasket(item.id);
        }); 
      }

      function RemoveItemFromBasket(id){
        dispatchBasket({
          type: actionTypes.REMOVE_FROM_BASKET,
          id: id
        });
      }

      async function DeleteFromDataBase(id){
        try {
          //let docRef = await addDoc(collection(db, "cuentas"), item);
          let itemToDelete = doc(db, "cuentas", user.userID, "carrito", id);
          await deleteDoc(itemToDelete);
          //console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
      }

      async function SaveOnDataBase(order){
        try {
          //let docRef = await addDoc(collection(db, "cuentas"), order);
          let newOrder = doc(collection(db, "cuentas", user.userID, "ordenes"));
          await setDoc(newOrder, order);
          //console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
      }

      return (
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.container}>
            <View style={styles.btnCon}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setShowGateway(true)}>
                <Text style={styles.btnTxt}>Pay Using PayPal</Text>
              </TouchableOpacity>
            </View>
          </View>
          {showGateway ? (
            <Modal
              visible={showGateway}
              onDismiss={() => setShowGateway(false)}
              onRequestClose={() => setShowGateway(false)}
              animationType={'fade'}
              transparent>
              <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                  <TouchableOpacity
                    style={{padding: 13}}
                    onPress={() => setShowGateway(false)}>
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#00457C',
                    }}>
                    PayPal GateWay
                  </Text>
                  <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                    <ActivityIndicator size={24} color={progClr} />
                  </View>
                </View>
                <WebView
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  source={{uri: url}}
                  style={{flex: 1}}
                  onLoadStart={() => {
                    setProg(true);
                    setProgClr('#000');
                  }}
                  onLoadProgress={() => {
                    setProg(true);
                    setProgClr('#00457C');
                  }}
                  onLoadEnd={() => {
                    setProg(false);
                  }}
                  onLoad={() => {
                    setProg(false);
                  }}
                  onMessage={onMessage}
                  
                  nativeConfig = {{
                    props: {
                      items: {}
                    }
                  }}
                  injectedJavaScript ={injectedToHtml()}
                  injectedJavaScriptBeforeContentLoaded={runFirst}
                />
              </View>
            </Modal>
          ) : null}
        </SafeAreaView>
      );
};

export default CheckoutScreen

const styles = StyleSheet.create({
    btnCon: {
        height: 45,
        width: '70%',
        elevation: 1,
        backgroundColor: '#00457C',
        borderRadius: 3,
      },
      btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      btnTxt: {
        color: '#fff',
        fontSize: 18,
      },
      webViewCon: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      wbHead: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        zIndex: 25,
        elevation: 2,
      },
})
