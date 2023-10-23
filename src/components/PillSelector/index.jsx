import React from "react";
import { PillsData } from "../../common/constant";
import { useAudio } from "../../context";

import styles from "./PillSelector.module.css";

let audioContext;
if ("AudioContext" in window || "webkitAudioContext" in window) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
} else {
  console.error("Web Audio API is not supported in this browser.");
}
const PillSelector = () => {
  const { setAudioPills } = useAudio();

  const pillClickHandler = (soundSource, soundName, soundColor) => {
    let duration;

    // Load and decode the audio file
    fetch(soundSource)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        // Decode the audio data
        audioContext
          .decodeAudioData(arrayBuffer, (buffer) => {
            // get duration of selected file
            duration = buffer.duration;

            // adding new file to state array
            setAudioPills((prevPills) => {
              const l = prevPills.length;

              // duration of last audio pill in state array
              const lastUpdatedDuration =
                l !== 0 ? prevPills[l - 1].duration : null;

              // starting point of last audio pill in state array
              const lastUpdatedStartpoint =
                l !== 0 ? prevPills[l - 1].startTime : null;

              // calculate new starting point for current audio file
              // just after the last audio file
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
  };

  return (
    <div className={styles.selectorContainer}>
      <p>Audio Samples</p>
      <div className={styles.pillsContainer}>
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
