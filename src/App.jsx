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

  // keep track of starting times of tracks
  const [startingTimes, setStartingTimes] = useState([]);
  // keep track of which audios are already played
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
        setStartingTimes(prevStartTimes => [...prevStartTimes, startTime]);
      })
      .then(() => {
        createNewState && addAudioPill(file)
      })
      .catch((error) => console.error("Error loading audio file: ", error));
  }

  useEffect(() => {
    // Logic pause and play audio source
    if (isPlaying) {
      if (audioContext.state === "suspended") {
        // resume audio context
        audioContext.resume();
      }
      // if playing for first time or already playing and audios are added
      // loop over source objects, get their startTimes
      // play only if not played earlier
      // start can only be called once or !Error
      if(audioContext.state !==  "running" || audioContext.state === "running"){
        audioSources.forEach((audioSrc, index) => {
          if(!playedAudios.includes(index)){
            audioSrc.start(startingTimes[index]);
            setPlayedAudios((prevAudios) => [...prevAudios, index]);
          }
        })
      }
    } else {
      // pause audio context
      audioContext.suspend();
    }
  }, [audioSources, isPlaying]);

  const playHandler = () => {
    setIsPlaying(!isPlaying);
  };

  // reset timeline to default
  const resetHandler = () => {
    setAudioPills([]);
    setAudioSources([]);
    setStartingTimes([]);
    setPlayedAudios([]);
  };

  // add new selected file to state
  const addAudioPill = (newAudioPill) => {
    const updatedPills = [...audioPills, newAudioPill];
    setAudioPills(updatedPills);
  };

  // Function to change the start time of an audio pill
  // gets the audioSource obj from state and stops
  // new source with updated timeline is added
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
      // pause audio context
      audioContext.suspend();
      // reset playing logic varaibles
      setAudioSources([])
      setStartingTimes([])
      setPlayedAudios([])
      // create new source objects from audio files data
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
