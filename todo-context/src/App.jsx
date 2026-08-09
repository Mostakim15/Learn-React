import { useState, useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { TodoProvider } from './context/TodoContext'
import TodoItem from './components/TodoItem'
import TodoForm from './components/TodoForm'

function App() {
  const [todos,setTodos] = useState([])

  const addTodo = (todo) => {
    setTodos((prevTodos) => [{id: Date.now(), ...todo}, ...prevTodos])
  }

  const updateTodo = (id, updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {...todo, ...updatedTodo}
        }
        return todo
      })
    )
  }

  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }
  
  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo.id === id) {
          return {...todo, completed: !todo.completed}
        }
        return todo
      })
    )
  }

 useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"))

    if (todos && todos.length > 0) {
      setTodos(todos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])


  return (
    <TodoProvider value={{todos,addTodo,removeTodo,toggleTodo,updateTodo}}>
    <div className="bg-[#172842] min-h-screen py-8">
          <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
              <h1 className="text-2xl font-bold text-center mb-8 mt-2">Manage Your Todos</h1>
              <div className="mb-4">
                  {/* Todo form goes here */} 
                  <TodoForm />
              </div>
              <div className="flex flex-wrap gap-y-3">
                  {/*Loop and Add TodoItem here */}
                  {todos.map((todo) => (
                    <div 
                    key={todo.id} 
                    className="w-full">
                      <TodoItem todo={todo} />
                    </div>
                  ))}

              </div>
          </div>
      </div>
    </TodoProvider>
  )
}

export default App
