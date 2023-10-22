import React, { useMemo } from "react";
import { useAudio } from "../../context";

import styles from "./Timeline.module.css";
import { calculateOffset, calculateWidth } from "../../common/utils";

const TimelineRow = ({ audioData, totalDuration }) => {
  const { audioName, duration, startPoint, bgColor } = audioData;
  return (
    <div className={styles.timelineRow}>
      <div
        style={{ 
          width: `${calculateWidth(duration, totalDuration)}%`,
          marginLeft: `${calculateOffset(startPoint, totalDuration)}%`,
          backgroundColor: bgColor,
        }}
        className={styles.rowPill}
      >
        <p>{audioName}</p>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { audioPills } = useAudio();

  const totalDuration = useMemo(
    () => audioPills.reduce((acc, pill) => (acc = acc + pill.duration), 0),
    [audioPills]
  );

  return (
    <div className={styles.timelineContainer}>
      {audioPills.map((pill) => (
        <TimelineRow audioData={pill} totalDuration={totalDuration} />
      ))}
      
    </div>
  );
};

export default Timeline;
