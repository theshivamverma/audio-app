import React, { useEffect, useState } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";

// Check if the Web Audio API is supported in the current browser\
let audioContext;
if ("AudioContext" in window || "webkitAudioContext" in window) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} else {
  console.error("Web Audio API is not supported in this browser.");
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const { audioPills, setAudioPills, totalDuration } = useAudio();

  const playHandler = () => {
    if (!isPlaying) {
      setIsPlaying(true);
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
          .catch((error) => console.error("Error loading audio file: ", error));
      });
    }
  };

  // rest timeline to default
  const resetHandler = () => {
    setAudioPills([]);
  }

  // progress bar update
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (progress > totalDuration) {
      setProgress(0);
    }
  }, [progress]);

  return (
    <div className="appContainer">
      <h1 className="appTitle">Let's Mix It!</h1>
      <PillSelector />
      <Timeline />
      {audioPills.length > 0 && (
        <div className="actionCenter">
          <div className="progressContainer">
            <div
              className="progressBar"
              style={{
                width: `${Math.round((progress * 100) / totalDuration)}%`,
              }}
            ></div>
          </div>
          <div className="buttonContainer">
            <button className="audioBtn" id="play-button" onClick={playHandler}>
              {isPlaying ? "Playing Audio..." : "Play"}
            </button>
            {!isPlaying && (
              <button className="audioBtn" onClick={resetHandler}>
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
