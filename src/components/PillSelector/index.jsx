import React from "react";
import { Howl } from "howler";
import { PillsData } from "../../common/constant";
import { useAudio } from "../../context";

import styles from "./PillSelector.module.css";

const PillSelector = () => {
  const { setAudioPills } = useAudio();

  const pillClickHandler = (soundSource, soundName, soundColor) => {
    const sound = new Howl({
      src: [soundSource],
    });
    let duration;

    sound.once("load", function () {
      duration = sound.duration();
      setAudioPills((prevPills) => {
        const l = prevPills.length;
        const lastUpdatedDuration = l !== 0 ? prevPills[l - 1].duration : null;
        const lastUpdatedStartpoint =
          l !== 0 ? prevPills[l - 1].startPoint : null;
        const newStartPoint = lastUpdatedDuration
          ? lastUpdatedDuration + lastUpdatedStartpoint
          : 0;
        return [
          ...prevPills,
          {
            id: Math.random(),
            audioName: soundName,
            soundObj: sound,
            duration,
            startPoint: newStartPoint,
            bgColor: soundColor
          },
        ];
      });
    });
  };

  return (
    <div className={styles.selectorContainer}>
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
  );
};

export default PillSelector;
