import React, { useEffect, useState } from "react";
import { PillSelector, Timeline } from "./components";
import { useAudio } from "./context";

import "./App.css";

function App() {
  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const [audioSources, setAudioSources] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const [startingTimes, setStartingTimes] = useState([]);
  const [playedAudios, setPlayedAudios] = useState([]);

  const { audioPills, setAudioPills, totalDuration } = useAudio();

  function createAndPlayAudioSource(file, createNewState = true) {
    const audioSource = audioContext.createBufferSource();

    // Load and decode the audio file
    fetch(file.path)
      .then((response) => response.arrayBuffer())
      .then((data) => audioContext.decodeAudioData(data))
      .then((decodedBuffer) => {
        audioSource.buffer = decodedBuffer;
        audioSource.connect(audioContext.destination);
        const startTime = file.startTime;
        setAudioSources((prevAudioSources) => [...prevAudioSources, audioSource]);
        setStartingTimes(prevStartTimes => [...prevStartTimes, startTime])
      })
      .then(() => {
        createNewState && addAudioPill(file)
      })
      .catch((error) => console.error("Error loading audio file: ", error));
  }

  useEffect(() => {
    // Function to pause and play audio source
    if (isPlaying) {
      if (audioContext.state === "suspended") {
        audioContext.resume();
      }
      if(audioContext.state !==  "running"){
        audioSources.forEach((audioSrc, index) => {
          if(!playedAudios.includes(index)){
            audioSrc.start(startingTimes[index]);
            setPlayedAudios((prevAudios) => [...prevAudios, index]);
          }
        })
      }else if(audioContext.state === "running"){
        audioSources.forEach((audioSrc, index) => {
          if(!playedAudios.includes(index)){
            audioSrc.start(startingTimes[index]);
            setPlayedAudios((prevAudios) => [...prevAudios, index]);
          }
        });
      }
    } else {
      audioContext.suspend();
    }
  }, [audioSources, isPlaying]);

  const playHandler = () => {
    setIsPlaying(!isPlaying);
  };

  // rest timeline to default
  const resetHandler = () => {
    setAudioPills([]);
    setAudioSources([]);
    setStartingTimes([]);
    setPlayedAudios([]);
  };

  const addAudioPill = (newAudioPill) => {
    const updatedPills = [...audioPills, newAudioPill];
    setAudioPills(updatedPills);
  };

  // // Function to change the start time of an audio pill
  const changeStartTime = (selectedIndex, selectedFile) => {
    if (selectedIndex >= 0 && selectedIndex < audioPills.length) {
      const audioSource = audioSources[selectedIndex];
      audioSource.stop(0);
      createAndPlayAudioSource({...selectedFile}, false)
    }
  };

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
      setIsPlaying(false);
      audioContext.suspend();
      setAudioSources([])
      setStartingTimes([])
      setPlayedAudios([])
      audioPills.forEach(pill => createAndPlayAudioSource(pill, false))
    }
  }, [progress, totalDuration]);

  return (
    <div className="appContainer">
      <h1 className="appTitle">Let's Mix It!</h1>
      <PillSelector
        createAndPlayAudioSource={createAndPlayAudioSource}
      />
      <Timeline changeStartTime={changeStartTime} />
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
              {isPlaying ? "Pause" : "Play"}
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
