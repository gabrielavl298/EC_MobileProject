import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView } from 'react-native'
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';

import { item, purchaseUnit } from '../models/CheckoutModels'; 

//Aux
import Themes from '../constants/Themes';
const CheckoutScreen = (props) => {
    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');
    const [finalPurchase, setFinalPurchase] = useState({})

    let cartData = props.route.params;

    const url = "https://et-web-77045.web.app"

    /*const jsCode = `document.body.style.backgroundColor = 'red';
    setTimeout(function() { window.alert('hi') }, 2000);
    true;`;*/

      function injectedToHtml() {
      let injectedData = `document.getElementById('fname').value = '${finalPurchase}';`;
      return injectedData;
     }
  

    useEffect(() => {
      let items = [];
      cartData.items.forEach(product => {
        let itemToBuy = new item(product.nombre, product.descripcion,
          product.precio, product.cantidad);

          items.push(itemToBuy.itemData);
      });

      let newPurchaseUnit = new purchaseUnit(cartData.total, items);
      setFinalPurchase(newPurchaseUnit.unit);
      console.log("Compra a realizar let: ", finalPurchase);

      return () => {
        
      }
    }, [])

    function onMessage(e) {
        let data = e.nativeEvent.data;
        setShowGateway(false);
        let payment = JSON.parse(data);
        if (payment.status === 'COMPLETED') {
          alert('PAYMENT MADE SUCCESSFULLY!');
        } else {
          alert('PAYMENT FAILED. PLEASE TRY AGAIN.');
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

                  injectedJavaScript = {
                    injectedToHtml()
                    //SetOrderInfo(finalPurchase)

                  }
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
