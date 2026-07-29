import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


function App() {
  let value = 10;
  let [count, setCount] = useState(value);

  const addValue = () =>{
    console.log("increase",count);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1); // previous value of count is used to update the state
    setCount(count + 1); // current value of count is used to update the state

  }

  const reduceValue =() =>
  {
    console.log("decrease",count);
    setCount(prevCount => prevCount - 1);
    setCount(count - 1);
    console.log("decrease after",count);
  }

  return (
    <>
     <h1 className='bg-gray-600 p-2'>Count react</h1>
     <h2>actual value {value}</h2>
     <br />
     <h2>count value {count}</h2>
     <button className='bg-gray-600 text-white p-2 rounded' onClick={addValue}>
    Add value
     </button>
<br />
     <button className='bg-gray-600 text-white p-1 rounded' onClick={reduceValue}>
     reduce value
     </button>
    </>
  )
}

export default App
