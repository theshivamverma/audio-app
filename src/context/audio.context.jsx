import { useContext, createContext, useState } from "react";

const AudioContext = createContext();

export const AudioProvider = ({children}) => {

  const [audioPills, setAudioPills] = useState([])

  return (
    <AudioContext.Provider value={{audioPills, setAudioPills}}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => useContext(AudioContext)