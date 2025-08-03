// firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCQ4-0rtOtTBeBAMB5YoZEZIWLcTnRyzF8",
  authDomain: "irrigation-system-58e87.firebaseapp.com",
  databaseURL: "https://irrigation-system-58e87-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "irrigation-system-58e87",
  storageBucket: "irrigation-system-58e87.firebasestorage.app",
  messagingSenderId: "1760635210",
  appId: "1:1760635210:web:b4ba0594e41a073619f9b3"
};

//databaseURL: "https://irrigation-system-58e87-default-rtdb.firebaseio.com/",

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export {database};