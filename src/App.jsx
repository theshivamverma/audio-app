import React, { useEffect } from 'react';
import { PillSelector, Timeline } from './components';
import { useAudio } from "./context";

import "./App.css";

function App() {

  const {audioPills} = useAudio();

  useEffect(() => {
    // Check if the Web Audio API is supported in the current browser
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const playButton = document.getElementById("play-button");

      // Event listener for the play button
      playButton.addEventListener("click", () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        audioPills.forEach((file) => {
          const audioSource = audioContext.createBufferSource();

          // Load and decode the audio file
          fetch(file.path)
            .then((response) => response.arrayBuffer())
            .then((data) => audioContext.decodeAudioData(data))
            .then((decodedBuffer) => {
              audioSource.buffer = decodedBuffer;
              audioSource.connect(audioContext.destination);
              audioSource.start(audioContext.currentTime + file.startTime);
            })
            .catch((error) =>
              console.error("Error loading audio file: ", error)
            );
        });
      });
    } else {
      console.error("Web Audio API is not supported in this browser.");
    }
  }, [audioPills])

  return (
    <div className="appContainer">
      <h1 className="appTitle">Audio app</h1>
      <PillSelector />
      <Timeline />
      <div className='buttonContainer'>
        <button className='audioBtn' id="play-button">Play</button>
      </div>
    </div>
  );
}

export default App
