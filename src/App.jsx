import React, { useEffect } from 'react';
import { PillSelector, Timeline } from './components';
import { useAudio } from "./context";

import "./App.css";

function App() {

  const {audioPills} = useAudio();

  useEffect(() => {
    console.log(audioPills)
  }, [audioPills])

  return (
    <div className='appContainer'>
      <h1 className='appTitle'>Audio app</h1>
      <PillSelector />
      <Timeline />
    </div>
  )
}

export default App
