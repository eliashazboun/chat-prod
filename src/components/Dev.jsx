/* eslint-disable no-unused-vars */
import { useState } from "react";
import { db, storage } from "../Firebase";
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { strip } from "../utils/utils";
import { getDownloadURL, ref } from "firebase/storage";
import { generateJSON } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";

const Dev = () => {
  const [imageUrl, setImageUrl] = useState()
  const [json, setJson] = useState()
  // const [items,setItems] = useState([])
  // const getPosts = async () => {
  //   const snapshot = await getDocs(collection(db, import.meta.env.DATABASE));
  //   snapshot.forEach(async (doc) => {
  //     await setDoc(doc.ref, {
  //       docId: doc.id,
  //     });
  //   });
  // };

  const press = async () => {
    const snapshot = await getDocs(collection(db,'comments'))
    snapshot.forEach(async(doc) => {
      const comment = doc.data()
      const text = comment.text
      const json = generateJSON(text,[
        StarterKit,
        Underline,
        Placeholder.configure({ placeholder: "Enter comment..." }),
      ])
      await updateDoc(doc.ref,{
        text:json
      })

    })

    
    console.log(json)
    }

    // const admins = []
    // const q = query(collection(db, import.meta.env.VITE_USERS), where('admin','==',true))
    // const snapshot = await getDocs(q)
    // snapshot.forEach(async (doc) => {
    //   admins.push(doc.data().nameLower)
    // })
    // const postsSnapshot = await getDocs(collection(db, "posts"))
    // postsSnapshot.forEach(async (docu) => {
    //   const post = docu.data()
    //   const nameLower = strip(post.user).toLowerCase()
    //   if(admins.includes(nameLower)=== false){
    //     await deleteDoc(docu.ref)
        
    //   }
    // })
 
   
    return (
      <>
        <button onClick={press}>Dev Button</button>
       
      </>
    );
  }


export default Dev;
