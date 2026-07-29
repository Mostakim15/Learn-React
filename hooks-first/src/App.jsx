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
    setCount(count+1);
  }

  const reduceValue =() =>
  {
    console.log("decrease",count);
    setCount(--count);
    console.log("decrease after",count);
  }

  return (
    <>
     <h1 className='bg-amber-300'>Count react</h1>
     <h2>actual value {value}</h2>
     <br />
     <h2>count value {count}</h2>
     <button onClick={addValue}>
    Add value
     </button>
<br />
     <button onClick={reduceValue}>reduce value</button>
    </>
  )
}

export default App
