import {initializeApp} from 'firebase/app';
import {getFirestore, collection, getDocs} from 'firebase/firestore'
//import { getAuth } from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyCxc4c4cQ2CLqpvGL2z7qiGCE_lbfKZ4RM",
  authDomain: "etacarinae-e197e.firebaseapp.com",
  projectId: "etacarinae-e197e",
  storageBucket: "etacarinae-e197e.appspot.com",
  messagingSenderId: "605036753784",
  appId: "1:605036753784:web:6c08c744b3b0e2a75c0e8d"
  };

  export const firebaseapp = initializeApp(firebaseConfig);
  export const db = getFirestore(firebaseapp);
  //export const auth = getAuth(firebaseapp);

  export const productDocs = async () => await getDocs(collection(db, 'productoInfo'));