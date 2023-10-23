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
    const parentWidth = e.currentTarget.parentElement.offsetWidth;
    setIsDragging(true);
    setStartX(e.clientX - (leftMargin * parentWidth) / 100);
    setSelectedPill(id);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newLeftMargin = e.clientX - startX;
      const parentWidth = e.currentTarget.parentElement.offsetWidth; // Get the parent's width
      const componentWidth = e.currentTarget.offsetWidth; // Get the component's width

      // Calculate the minimum and maximum allowed left margins
      const minLeftMargin = 0;
      const maxLeftMargin = parentWidth - componentWidth;

      // Clamp the newLeftMargin to stay within the bounds
      const clampedLeftMargin = Math.max(
        minLeftMargin,
        Math.min(newLeftMargin, maxLeftMargin)
      );

      const percentMargin = (clampedLeftMargin / parentWidth) * 100;

      setLeftMargin(percentMargin);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
  const { audioPills } = useAudio();

  const totalDuration = audioPills.reduce(
    (acc, pill) => (acc = acc + pill.duration),
    0
  );

  return (
    <div className={styles.timelineContainer}>
      {audioPills.map((pill) => (
        <TimelineRow
          key={pill.id}
          audioData={pill}
          totalDuration={totalDuration}
        />
      ))}
    </div>
  );
};

export default Timeline;
