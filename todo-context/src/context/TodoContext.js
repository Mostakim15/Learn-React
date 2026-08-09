// this file for context api to implement the context and provider for the todo application
import {createContext, useState} from 'react'

export const TodoContext = createContext({ // this is for creating the context for the todo application
    todos: [],
    addTodo: (todo) => {},
    removeTodo: (id) => {},
    toggleTodo: (id) => {},
    updateTodo: (id, updatedTodo) => {},
})

export const useTodo = () => { // this is for custom hook to use the context in other components
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider // this is for provider to wrap the components that need access to the context