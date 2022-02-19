import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Firebase

//Stacks
import DrawerNav from './navigation/DrawerNav';
import LoginStack from './navigation/LoginStack';

//utils
import { StateProvider } from './utils/StateProvider';
import reducer, { initialState } from './utils/Reducer';


const Stack = createNativeStackNavigator();
export default function App() {
  
  return (
    <View style={styles.container}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="DrawerNav" component={DrawerNav} options={{headerShown: false}} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </StateProvider>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
});
