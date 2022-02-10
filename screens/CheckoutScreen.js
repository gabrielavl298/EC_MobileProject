import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Modal, ActivityIndicator, SafeAreaView } from 'react-native'
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';

//Aux
import Themes from '../constants/Themes';
const CheckoutScreen = () => {
    const [showGateway, setShowGateway] = useState(false);
    const [prog, setProg] = useState(false);
    const [progClr, setProgClr] = useState('#000');

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
            animationType={"fade"}
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
                source={{uri: 'https://et-web-77045.web.app/'}}
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
