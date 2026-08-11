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
        
        removeTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },//action gives the data that is passed to the reducer function
        
        updateTodo: (state, action) => {
            const {id, text} = action.payload;
            const existingTodo = state.todos.find(todo => todo.id === id);
            if (existingTodo) {
                existingTodo.text = text;
            }
        },

        toggleTodo: (state, action) => {
            const existingTodo = state.todos.find(todo => todo.id === action.payload);
            if (existingTodo) {
                existingTodo.completed = !existingTodo.completed;
            }
        }
    },
});

export const {addTodo, removeTodo, updateTodo, toggleTodo} = todoSlice.actions;

export default todoSlice.reducer; //exporting the reducer function to be used in the stores