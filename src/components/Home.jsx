import React, { useState } from 'react'
import Todo from './Todo'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Home() {
  const[userData, setUserData] = useState(null)
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const handleLogin = () => {
    signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    console.log(token)
    console.log(user)
    console.log(credential)
    setUserData(user)
    
  }).catch((error) => {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const email = error.customData.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error)
  });
  }
  return (
    <div>

        {!userData && <div className='flex justify-center mb-10'>
          <button onClick={handleLogin} className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-sm'>Login/Signup with Google</button>
        </div>}
        {userData && <h1 className='text-center text-2xl font-semibold text-blue-500'>Hello {userData && userData.providerData[0].displayName}</h1>}
        {userData && <Todo></Todo>}
    </div>
  )
}
