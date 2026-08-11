import {createSlice, nanoid} from '@reduxjs/toolkit';

const initialState = {
    todos: [{
        id: nanoid(),
        text: 'Hello world',
        completed: false
    }],
}

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                text: action.payload, //action.payload gives the data that is passed to the reducer function
                completed: false
            }
            state.todos.push(todo); //state gives the current data situation in todos
        }, //state gives the current data situation in todos
        
        removeTodo: (state, action) => {},//action gives the data that is passed to the reducer function
        toggleTodo: (state, action) => {},
    },
});