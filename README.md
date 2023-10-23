# Let's Mix It!
### An audio app to create amazing sound effects by mixing audio files together.

## Steps to run on local

- Clone the repo
- run `npm install`
- run `npm run dev`

### Tech stack

- JavaScript
- React

#### Features
- Select audio file from list of pills.
- Edit timeline for playing files by dragging pills left and right


#### Approach
- We have used Web Audio APIs for handling audio files
- In initial stages there was consideration to use battle tested audio library `Howler.js`.
- But to play multiple audio files simultaneously and based on different start points seemed to be challenging with `Howler` so we moved away from it to bare bones vanilla implementation
- The rendering logic for timeline pills is fairly simple
- Width of pill = `(audioFileDuration/totalTimelineDuration) * 100`.
- Position of audio pill = `(audioStartTime/totalTimelineDuration) * 100`.
- For dragging the audio pills left and right we have used vanilla JS again. 
- `react-dnd` was considered and tried but seemed to not fit with our use case.
- The progress bar is being changed with a `setInterval`.
