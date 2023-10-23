import React, { useEffect, useState } from "react";
import { useAudio } from "../../context";
import { calculateOffset, calculateWidth } from "../../common/utils";

import styles from "./Timeline.module.css";

const TimelineRow = ({ audioData, totalDuration }) => {
  const { audioName, duration, startTime, bgColor, id } = audioData;
  const { audioPills, setAudioPills } = useAudio();

  const [isDragging, setIsDragging] = useState(false);
  const [leftMargin, setLeftMargin] = useState(
    calculateOffset(startTime, totalDuration)
  );
  const [startX, setStartX] = useState(0);

  const [selectedPill, setSelectedPill] = useState("");

  const handleMouseDown = (e, id) => {
    // width of container
    const parentWidth = e.currentTarget.parentElement.offsetWidth;
    setIsDragging(true);

    // set starting x co-ordinate, converting percent to pixels
    setStartX(e.clientX - (leftMargin * parentWidth) / 100);

    // set selected audio pill
    setSelectedPill(id);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      // new margin from mouse position - initial x
      const newLeftMargin = e.clientX - startX;

      // Get the parent's width
      const parentWidth = e.currentTarget.parentElement.offsetWidth;

      // Get the component's width
      const componentWidth = e.currentTarget.offsetWidth;

      // Calculate the minimum and maximum allowed left margins
      const minLeftMargin = 0;
      const maxLeftMargin = parentWidth - componentWidth;

      // Clamp the newLeftMargin to stay within the bounds
      const clampedLeftMargin = Math.max(
        minLeftMargin,
        Math.min(newLeftMargin, maxLeftMargin)
      );

      // percent margin from pixels
      const percentMargin = (clampedLeftMargin / parentWidth) * 100;

      // set new margin value
      setLeftMargin(percentMargin);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // update audio start time based on dragged position
    setAudioPills((prevPills) => {
      return prevPills.map((pill) => {
        if (pill.id === selectedPill) {
          pill.startTime = (totalDuration * leftMargin) / 100;
        }
        return pill;
      });
    });
  };

  useEffect(() => {
    setLeftMargin(calculateOffset(startTime, totalDuration));
  }, [audioPills]);


  // audio pills are rendered based on their duration and starting point compared to total duration of the timeline
  // width represents the time for which it will be played and offset represents when it will start playing;
  
  return (
    <div className={styles.timelineRow}>
      <div
        style={{
          width: `${calculateWidth(duration, totalDuration)}%`,
          marginLeft: `${leftMargin}%`,
          backgroundColor: bgColor,
        }}
        className={`${styles.rowPill} ${isDragging ? styles.dragging : ""}`}
        onMouseDown={(e) => handleMouseDown(e, id)}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <p>{audioName}</p>
      </div>
    </div>
  );
};

const Timeline = () => {
  const { audioPills, totalDuration } = useAudio();

  return (
    <div className={styles.timelineContainer}>
      {audioPills.length > 0 ? audioPills.map((pill) => (
        <TimelineRow
          key={pill.id}
          audioData={pill}
          totalDuration={totalDuration}
        />
      )) : (
        <p>Select audio files to create your own audio timeline.</p>
      )}
    </div>
  );
};

export default Timeline;
