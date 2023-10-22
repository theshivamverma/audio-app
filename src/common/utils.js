export const calculateWidth = (audioDuration, totalDuration) => {
  return Math.round((audioDuration/totalDuration) * 100)
}

export const calculateOffset = (start, totalDuration) => {
  return Math.round((start / totalDuration) * 100);
}