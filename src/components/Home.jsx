import React, { useState, useEffect } from 'react'
import Todo from './Todo'
import { logoutUser, setUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { fetchTodos } from '../features/todos/todoSlice';

export default function Home() {
  const provider = new GoogleAuthProvider();
  const userDetails = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const auth = getAuth();
  const [loadding, setLoading] = useState(true);

  const handleLogin = () => {
    signInWithPopup(auth, provider)
  .then(async(result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    await user.reload();
    dispatch(setUser({
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      uid: user.uid
    }))
    
  }).catch((error) => {
    console.log(error)
  });
  }

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutUser())
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    const unsubscribe =  onAuthStateChanged(auth, (user) => {
      if(user) {
        dispatch(setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid
        }))
      }else{
        dispatch(logoutUser())
        dispatch(fetchTodos(user?.uid))
      }
      setLoading(false)
    })
    return () => unsubscribe();
  },[dispatch, auth])
  if(loadding) {
    return (
      <div className="text-center py-10 text-gray-500">
        Checking authentication...
      </div>
    )
  }
  return (
    <div>
        {userDetails ? (
        <>
          <div className='flex justify-end mb-5'>
            <button onClick={handleLogOut} className='bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md'>Logout</button>
          </div>
          <div className='flex justify-center mb-5'>
            <img className="w-16 h-16 rounded-full object-cover border" src={userDetails.photo ||'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541'} alt={userDetails.name} referrerPolicy='no-referrer' />
          </div>
          <h1 className='text-center text-2xl font-semibold text-blue-500'>{userDetails.name}</h1>
          <Todo />
          {/* {console.log(userDetails)} */}
        </>
      ) : (
        <div className='flex justify-center mt-10'>
          <button onClick={handleLogin} className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md'>Login/Signup with Google</button>
        </div>
      )}
    </div>
  )
}
