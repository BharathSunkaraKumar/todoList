import React from 'react'

export default function Todo() {
  return (
    <div>
        <h1 className='font-bold text-3xl text-center my-10'>Todo-List</h1>
        <div className='flex'>
            <input className='px-2 border-2 py-4 w-full' type='text' name='todo' placeholder='enter todo'/>
            <button className='px-4 py-2 bg-black text-white'>Add Todo</button>
        </div>
    </div>
  )
}
