import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, fetchTodos, updateTodo } from '../features/todos/todoSlice';
import LoadingSpinner from './LoadingSpinner';

export default function Todo() {
  const [text, setText] = useState('');
  const [Editing, setEditing] = useState({
    isEditing: false,
    todo:'',
    id: ''
  });
  const [editText, setEditText] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const todos = useSelector((state) => state.todos.items)
  const loading = useSelector((state) => state.todos.loading)

  useEffect(() => {
    if(user?.uid) {
      dispatch(fetchTodos(user.uid))
    }
  }, [dispatch, user])
  
  const handleAdd = () => {
    console.log('add')
    if(text.trim() && user?.uid) {
      dispatch(addTodo({uid: user.uid, text}))
      setText('')
    }
  }

  const handleDelete = (id) => {
    if(!user) return;
    dispatch(deleteTodo({uid: user.uid, id}))
  }

  const handleEdit = (todo) => {
    setEditing({
      isEditing: true,
      id: todo.id,
      todo: todo.text
    })
    setText(todo.text)
  }

  const handleSave = () => {
    if(Editing.isEditing) {
      dispatch(updateTodo({id:Editing.id, newText: text}))
    }
    console.log(editText)
    setText('')
    setEditing({
      isEditing: false,
      id: '',
      todo: ''
    })
  }
  return (
    <div>
        <h1 className='font-bold text-3xl text-center my-10'>Todo List</h1>
        <div className='flex'>
            <input className='px-2 border-2 py-4 w-full' type='text' value={text} onChange={(e)=>setText(e.target.value)} name='todo' placeholder='enter todo'/>
            {
              Editing.isEditing ? (
                <button onClick={handleSave} className='hover:bg-gray-900 px-4 py-2 bg-lime-500 text-black'>save</button>
              ) : (
                <button onClick={handleAdd} className='hover:bg-gray-900 px-4 py-2 bg-black text-white'>Add Todo</button>
              )
            }
        </div>
        {/* <div>
          {
            isEditing && (
              <input type='text' className='border px-2 py-1 rounded' value={editText} onChange={(e)=> setEditText(e.target.value)} />
            )
          }
        </div> */}
          {!loading && todos.length === 0 && <p className='text-center my-5 text-2xl font-mono'>Add some todos</p>}
          {loading ? <LoadingSpinner/> : (
            <ul>
              {
            todos.map((todo ) => (
              <li 
              className='text-2xl border-2 px-2 py-4 my-2 rounded-md flex justify-between hover:bg-gray-100'
              key={todo.id}>
                {todo.text}
                <span className='mx-2'>
                  <button onClick={()=>{handleDelete(todo.id, todo)}} className='hover:text-red-500 mr-5'>{
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.687 6.213L6.8 18.976a2.5 2.5 0 0 0 2.466 2.092h3.348m6.698-14.855L17.2 18.976a2.5 2.5 0 0 1-2.466 2.092h-3.348m-1.364-9.952v5.049m3.956-5.049v5.049M2.75 6.213h18.5m-6.473 0v-1.78a1.5 1.5 0 0 0-1.5-1.5h-2.554a1.5 1.5 0 0 0-1.5 1.5v1.78z"/></svg>
                }
                </button>
                <span className='hover:text-cyan-500'>
                    <button onClick={()=>{handleEdit(todo)}}>

                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04L27.87 7.863zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936l-.097 2.658zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z"/></svg>
                      </button>
                </span>
                </span>
              </li>
            ))
          }
            </ul>

          )}
    </div>
  )
}


// {isEditing ? (
//                       <button onClick={()=>{handleSave(todo.id)}}>

//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="M5.008 2H2.282c-.181 0-.245.002-.275.007c-.005.03-.007.094-.007.275v11.436c0 .181.002.245.007.275c.03.005.094.007.275.007h11.436c.181 0 .245-.002.275-.007c.005-.03.007-.094.007-.275V4.62c0-.13-.001-.18-.004-.204a2.654 2.654 0 0 0-.141-.147L11.73 2.145a2.654 2.654 0 0 0-.147-.141A2.654 2.654 0 0 0 11.38 2h-.388c.005.08.008.172.008.282v2.436c0 .446-.046.607-.134.77a.909.909 0 0 1-.378.378c-.163.088-.324.134-.77.134H6.282c-.446 0-.607-.046-.77-.134a.909.909 0 0 1-.378-.378C5.046 5.325 5 5.164 5 4.718V2.282c0-.11.003-.202.008-.282M2.282 1h9.098c.259 0 .348.01.447.032a.87.87 0 0 1 .273.113c.086.054.156.11.338.293l2.124 2.124c.182.182.239.252.293.338a.87.87 0 0 1 .113.273c.023.1.032.188.032.447v9.098c0 .446-.046.607-.134.77a.909.909 0 0 1-.378.378c-.163.088-.324.134-.77.134H2.282c-.446 0-.607-.046-.77-.134a.909.909 0 0 1-.378-.378c-.088-.163-.134-.324-.134-.77V2.282c0-.446.046-.607.134-.77a.909.909 0 0 1 .378-.378c.163-.088.324-.134.77-.134M6 2.282v2.436c0 .181.002.245.007.275c.03.005.094.007.275.007h3.436c.181 0 .245-.002.275-.007c.005-.03.007-.094.007-.275V2.282c0-.181-.002-.245-.007-.275A2.248 2.248 0 0 0 9.718 2H6.282c-.181 0-.245.002-.275.007c-.005.03-.007.094-.007.275M8 12a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0-1a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/></svg>
//                       </button>
//                     ):(
//                       <button onClick={()=>{handleEdit(todo)}}>

//                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"><path fill="currentColor" d="M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04L27.87 7.863zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936l-.097 2.658zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z"/></svg>
//                       </button>
//                     )}