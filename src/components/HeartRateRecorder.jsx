import React, { useState } from 'react';
import { useVoiceToText } from './useVoiceToText';

const HeartRateRecorder = () => {
  const { transcript, listening, browserSupportsSpeechRecognition, startVoiceRecognition, stopVoiceRecognition } = useVoiceToText();
  const [heartRate, setHeartRate] = useState(null);

  // Start recording on button press
  const handleStart = () => {
    startVoiceRecognition();
  };

  // Stop recording on button release and attempt to extract a heart rate
  const handleStop = () => {
    stopVoiceRecognition();
    // Try to parse the transcript as a number (e.g., heart rate)
    const parsedRate = parseInt(transcript, 10);
    if (!isNaN(parsedRate)) {
      setHeartRate(parsedRate);
    }
  };

  // Fallback content if speech recognition is not supported
  if (!browserSupportsSpeechRecognition) {
    return <div>Sorry, your browser doesn't support speech recognition.</div>;
  }

  return (
    <div>
      <button
        // Support both touch and mouse events for better mobile support
        onMouseDown={handleStart}
        onMouseUp={handleStop}
        onTouchStart={handleStart}
        onTouchEnd={handleStop}
      >
        Hold to record heart rate
      </button>
      <div>
        <p>{listening ? 'Listening...' : 'Not listening'}</p>
        <p>Transcript: {transcript}</p>
        {heartRate !== null && <p>Detected Heart Rate: {heartRate} BPM</p>}
      </div>
    </div>
  );
};

export default HeartRateRecorder;