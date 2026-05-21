import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3UGYbT7l71um_Psz-nm1PTMYhTdGBVw0",
  authDomain: "crudfirebase-5e808.firebaseapp.com",
  databaseURL: "https://crudfirebase-5e808-default-rtdb.firebaseio.com",
  projectId: "crudfirebase-5e808",
  storageBucket: "crudfirebase-5e808.firebasestorage.app",
  messagingSenderId: "197584301543",
  appId: "1:197584301543:web:1d2133338e3b334988e142",
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);