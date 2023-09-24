import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA94M6HBJIhdUOIzxhNURKHaV9B2Pj7LWY",
  authDomain: "chat-production-3e90d.firebaseapp.com",
  projectId: "chat-production-3e90d",
  storageBucket: "chat-production-3e90d.appspot.com",
  messagingSenderId: "659568637071",
  appId: "1:659568637071:web:a3bee5770f62528461acfa",
  measurementId: "G-G550H7CYG2"
};

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)

