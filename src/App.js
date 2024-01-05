
import './App.css';
import React,{useRef, useState} from 'react';

import firebase from 'firebase/compat/app';

import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/analytics';

//Importing an inbuilt firebase hook that will be used for authentication
import {useAuthState} from 'react-firebase-hooks/auth';

import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //Your Confguration here
  apiKey: "AIzaSyAERCkzjN25I4hyWhuPilhqEwIRMO8jo0o",
  authDomain: "react-chat-app-2ef1c.firebaseapp.com",
  projectId: "react-chat-app-2ef1c",
  databaseURL:"https:/react-chat-app-2ef1c.firebaseio.com",
  storageBucket: "react-chat-app-2ef1c.appspot.com",
  messagingSenderId: "401406161531",
  appId: "1:401406161531:web:ce140fca40f02cd0a828de",
  measurementId: "G-CBWQJBWYN3"
})

const auth = firebase.auth();

const firestore = firebase.firestore();
function App() {
   
  const [user] = useAuthState(auth);
  //This firebase will tell me automatically that whether sombody has opened or not..
  

  //This is responsible for the design part of the chat app
  return (
    <div className="App">
      <header>
        <h1>Lets Chat</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/>:<SignIn/>}
      </section>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
   return(
    <>
      <button className='sign-in' onClick={signInWithGoogle}>Sign In With Google</button>
      <p>Let's conect to talk and grow together.#WeWillRock</p>
    </>
   )
}
function SignOut(){
   
  return auth.currentUser &&(
    <button className='sign-out' onClick={()=> auth.signOut()}>Sign Out</button>
  )
  
}
function ChatRoom(){
    
   const dummy = useRef();

   const messagesRef = firestore.collection('messages');

   const query = messagesRef.orderBy('createdAt').limit(1500);

   const [messages] = useCollectionData(query,{idField:'id'});
   
   const [formValue,setFormValue] = useState('');

   const sendMessage = async (e) =>{

        e.preventDefault();

        const {uid,photoURL} = auth.currentUser;

        await messagesRef.add({
          text : formValue,
          createdAt : firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL
        })

     setFormValue('');
     dummy.current.scrollIntoView({behavior:'smooth'});
   }
   return(
    <>
    
    {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg}/>)}

    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='talk something'/>
      <button type='submit' disabled = {!formValue}>Go</button>
    </form>
    </>
   )
}

//This has to print the message
function ChatMessage(props){
   
    const {text,uid,photoURL} = props.message;

    //I will be defining the class....sent or recevied
    //According to sent and recevied ....I can use the Css

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recevied';

    return(
      <>
      <div className={'message ${messageClass}'}>
        <img src= {photoURL} />
        <p>{text}</p>
      </div>
      </>
    )
}

export default App;
