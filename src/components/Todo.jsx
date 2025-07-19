import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, fetchTodos } from '../features/todos/todoSlice';
import LoadingSpinner from './LoadingSpinner';

export default function Todo() {
  const [text, setText] = useState('');
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
  return (
    <div>
        <h1 className='font-bold text-3xl text-center my-10'>Todo List</h1>
        <div className='flex'>
            <input className='px-2 border-2 py-4 w-full' type='text' value={text} onChange={(e)=>setText(e.target.value)} name='todo' placeholder='enter todo'/>
            <button onClick={handleAdd} className='hover:bg-gray-900 px-4 py-2 bg-black text-white'>Add Todo</button>
        </div>
          {!loading && todos.length === 0 && <p className='text-center my-5 text-2xl font-mono'>Add some todos</p>}
          {loading ? <LoadingSpinner/> : (
            <ul>
              {
            todos.map((todo ) => (
              <li 
              className='text-2xl border-2 px-2 py-4 my-2 rounded-md flex justify-between hover:bg-gray-100'
              key={todo.id}>
                {todo.text}
                <spna>
                  <button onClick={()=>{handleDelete(todo.id)}} className='hover:text-red-500'>{
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.687 6.213L6.8 18.976a2.5 2.5 0 0 0 2.466 2.092h3.348m6.698-14.855L17.2 18.976a2.5 2.5 0 0 1-2.466 2.092h-3.348m-1.364-9.952v5.049m3.956-5.049v5.049M2.75 6.213h18.5m-6.473 0v-1.78a1.5 1.5 0 0 0-1.5-1.5h-2.554a1.5 1.5 0 0 0-1.5 1.5v1.78z"/></svg>
                }</button>
                </spna>
              </li>
            ))
          }
            </ul>

          )}
    </div>
  )
}
