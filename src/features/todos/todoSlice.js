import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import {
    collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where
} from 'firebase/firestore';

export const fetchTodos = createAsyncThunk('todos/fetchTodos' , async(uid) => {
    const q = query(collection(db, 'todos'), where('uid', '==', uid));
    const querysnapShot = await getDocs(q);
    return querysnapShot.docs.map(doc=> ({id: doc.id, ...doc.data()}));
});

export const addTodo = createAsyncThunk('todos/addTodo', async({text, uid})=> {
    const newTodo = {text, uid, completed: false};
    const docRef = await addDoc(collection(db, 'todos'), newTodo);
    return {id: docRef.id, ...newTodo};
})

const todoSlice = createSlice({
    name: 'todos',
    initialState: [],
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.fulfilled, (state, action) => action.payload)
            .addCase(addTodo.fulfilled, (state, action) => {state.push(action.payload);})
    }
})

export default todoSlice.reducer