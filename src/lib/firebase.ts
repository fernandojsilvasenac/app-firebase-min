import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
//import { getReactNativePersistence } from "firebase/auth/react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
console.log("FIREBASE CONFIG ",firebaseConfig);

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

const getRNPersistence = () =>{
    try {
        const rn = require("firebase/auth/react-native")
        return rn.getReactNativePersistence;
    } catch {
        // fallback: tenta pegar do auth normal (se não existir)
        const auth = require("firebase/auth");
        return auth.getReactNativePersistence;
    }
}
             
export const auth = ( () =>{
    try {
        const getReactNativePersistence = getRNPersistence()
        return initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    } catch (error) {
        return getAuth(app)
    }
})
export const db = getFirestore(app);




