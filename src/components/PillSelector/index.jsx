import React from "react";
import { PillsData } from "../../common/constant";
import { useAudio } from "../../context";

import styles from "./PillSelector.module.css";

const PillSelector = () => {
  const { setAudioPills } = useAudio();

  const pillClickHandler = (soundSource, soundName, soundColor) => {
    let duration;
    if ("AudioContext" in window || "webkitAudioContext" in window) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      const audioSource = audioContext.createBufferSource();

      // Load and decode the audio file
      fetch(soundSource)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          // Decode the audio data
          audioContext
            .decodeAudioData(arrayBuffer, (buffer) => {
              duration = buffer.duration;
              setAudioPills((prevPills) => {
                const l = prevPills.length;
                const lastUpdatedDuration =
                  l !== 0 ? prevPills[l - 1].duration : null;
                const lastUpdatedStartpoint =
                  l !== 0 ? prevPills[l - 1].startTime : null;
                const newStartPoint = lastUpdatedDuration
                  ? lastUpdatedDuration + lastUpdatedStartpoint
                  : 0;
                return [
                  ...prevPills,
                  {
                    id: Math.random(),
                    audioName: soundName,
                    path: soundSource,
                    duration,
                    startTime: newStartPoint,
                    bgColor: soundColor,
                  },
                ];
              });
            })
            .catch((error) => {
              console.error("Error decoding audio data:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching audio file:", error);
        });
    } else {
      console.error("Web Audio API is not supported in this browser.");
    }
  };

  return (
    <div className={styles.selectorContainer}>
      <p>Audio Samples</p>
      <div className="pillsContainer">
        {PillsData.map(({ src, bgColor, name }) => (
          <button
            key={name}
            className={styles.selectorBtn}
            style={{ backgroundColor: bgColor }}
            onClick={() => pillClickHandler(src, name, bgColor)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PillSelector;
