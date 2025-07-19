import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebaseConfig";
import {
    collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where
} from 'firebase/firestore';

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos' , 
    async(uid) => {
    const querysnapShot = await getDocs(collection(db, 'users', uid, 'todos'));
    const todos = [];
    querysnapShot.forEach((doc) => {
        todos.push({id: doc.id, ...doc.data()})
    })
    return todos;
});

export const addTodo = createAsyncThunk(
    'todos/addTodo', 
    async({text, uid})=> {
    // const newTodo = {text, uid, completed: false};
    const docRef = await addDoc(collection(db, 'users', uid, 'todos'), {
        text,
        completed: false,
        createdAt: Date.now(),
    });
    return {id: docRef.id, text, completed: false};
})

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async ({uid, id}, thunkAPI) => {
        try{
            await deleteDoc(doc(db, `users/${uid}/todos/${id}`));
            return id
        }catch(error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const updateTodo = createAsyncThunk(
    'todos/updateTodo',
    async({id, newText}, {getState, rejectWithValue}) => {
        const user = getState().auth.user;
        if(!user) return rejectWithValue('user not logged in')
        try{
            const todoRef = doc(db,'users', user.uid, 'todos', id);
            await updateDoc(todoRef, {text: newText});
            return {id, newText}
        }catch(error) {
            console.log(error)
            return rejectWithValue(error.message)
        }
    }
)

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
             .addCase(addTodo.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTodo.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.items = state.items.filter(todos => todos.id != action.payload)
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                const {id, newText} = action.payload;
                const todo = state.items.find((item) => item.id === id);
                if(todo) {
                    todo.text = newText
                }
            })
    }
})

export default todoSlice.reducer