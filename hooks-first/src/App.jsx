import { useCallback, useState, useEffect,useRef} from 'react'
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
  const [color, setColor] = useState("#10151c");

  //password generator using useState hook
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [symbolAllowed, setSymbolAllowed] = useState(false);
  const [copy, setCopy] = useState(false);
  const [password, setPassword] = useState("");

  const generatePassword =useCallback (() => {
    const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
    const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let characters = lowerCaseChars + upperCaseChars;
    if (numberAllowed) {
      characters += numberChars;
    }
    if (symbolAllowed) {
      characters += symbolChars;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      generatedPassword += characters[randomIndex];
    }
    setPassword(generatedPassword);
  }, [length, numberAllowed, symbolAllowed]);
   
  useEffect(() => {
    generatePassword();
  }, [generatePassword, length, numberAllowed, symbolAllowed]);

  const refPassword = useRef(null);

  const cpyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(password);
    refPassword.current.select();

    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }, [password]);

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
  
  <div className="fixed flex flex-col items-center justify-center  bottom-75 left-20 right-20 gap-2 bg-indigo-600/20 text-white px-4" >
   <h2 className='pt-4 pb-0.5'>Password Generator</h2>
    <div className="flex mb-2">
      <input 
      type="text"
      className="p-2 rounded-l w-full outline-none shadow-amber-950-500/50 shadow-lg"
      placeholder="Password"
      readOnly
      value={password}
      ref={refPassword}

      />
      <button className="bg-blue-500/30 text-white p-2 rounded-r hover:bg-blue-200" onClick={cpyToClipboard}>
        Copy
      </button>
      <div
        className={`absolute -top-8 left-1/2 -translate-x-1/2
          bg-black text-white text-xs px-3 py-1 rounded
          transition-all duration-300
          ${
            copy
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
      >
        Copied!
      </div>
      
    </div>
    <div className="flex items-center gap-2 mb-2">
      <div className="flex items-center gap-2">
        <input
        type="range"
        min="6"
        max="20"
        value={length}
        onChange={(e) => setLength(e.target.value)}
        className="w-full"
        />
        <label className="text-white">Length:{length}</label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="number"
          onclick={() => setNumberAllowed((prev) => !prev)}
          onChange={(e) => setNumberAllowed(e.target.checked)}
        />
        <label htmlFor="number" className="text-white">
          Include Numbers
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="symbol"
          onclick={() => setSymbolAllowed((prev) => !prev)}
          onChange={(e) => setSymbolAllowed(e.target.checked)}
        />
        <label htmlFor="symbol" className="text-white">
          Include Symbols
        </label>
      </div>

    </div>
    

  </div>

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
