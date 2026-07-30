import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


function App() {

  // simple counter using useState hook
  // let value = 10;
  // let [count, setCount] = useState(value);

  // const addValue = () =>{
  //   console.log("increase",count);
  //   setCount(prevCount => prevCount + 1);
  //   setCount(prevCount => prevCount + 1); // previous value of count is used to update the state
  //   setCount(count + 1); // current value of count is used to update the state

  // }

  // const reduceValue =() =>
  // {
  //   console.log("decrease",count);
  //   setCount(prevCount => prevCount - 1);
  //   setCount(count - 1);
  //   console.log("decrease after",count);

  //background color change using useState hook
  const [color, setColor] = useState("#ffffff");
   

  return (
    //commented out the counter code for now, can be used later
//     <>
//      <h1 className='bg-gray-600 p-2'>Count react</h1>
//      <h2>actual value {value}</h2>
//      <br />
//      <h2>count value {count}</h2>
//      <button className='bg-gray-600 text-white p-2 rounded' onClick={addValue}>
//     Add value
//      </button>
// <br />
//      <button className='bg-gray-600 text-white p-1 rounded' onClick={reduceValue}>
//      reduce value
//      </button>
//     </>

<div className="w-full h-screen duration-500" 
style={{backgroundColor:color}}>

 <div className="fixed flex flex-wrap items-center justify-center bottom-10 left-0 right-0 gap-2 bg-amber-50 p-2 rounded">
    <button className='bg-red-500 text-white p-2 rounded-xl' onClick={() => setColor("#ff0000")}>
      Red
    </button>
    <button className='bg-green-500 text-white p-2 rounded-xl' onClick={() => setColor("#00ff00")}>
      Green
    </button>
    <button className='bg-blue-500 text-white p-2 rounded-xl' onClick={() => setColor("#0000ff")}>
      Blue
    </button>
    <button className='bg-yellow-500 text-white p-2 rounded-xl' onClick={() => setColor("#ffff00")}>
      Yellow
    </button>
    <button className='bg-purple-500 text-white p-2 rounded-xl' onClick={() => setColor("#800080")}>
      Purple
    </button>
    <button className='bg-gray-500 text-white p-2 rounded-xl' onClick={() => setColor("#808080")}>
      Gray
    </button>
    <button className='bg-pink-500 text-white p-2 rounded-xl' onClick={() => setColor("#ffc0cb")}>
      Pink
    </button>
    <button className='bg-orange-500 text-white p-2 rounded-xl' onClick={() => setColor("#ffa500")}>
      Orange
    </button>
    <button className='bg-cyan-500 text-white p-2 rounded-xl' onClick={() => setColor("#00ffff")}>
      Cyan
    </button>
    <button className='bg-lime-500 text-white p-2 rounded-xl' onClick={() => setColor("#00ff00")}>
      Lime
    </button>
    <button className='bg-teal-500 text-white p-2 rounded-xl' onClick={() => setColor("#008080")}>
      Teal
      </button>
      <button className='bg-[#10151c] text-white p-2 rounded-xl' onClick={() => setColor("#10151c")}>
      Black
      </button>
 </div>
</div>
  )
}

export default App
