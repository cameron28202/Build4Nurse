import { useSpeechRecognition } from 'react-speech-recognition';
import SpeechRecognition from 'react-speech-recognition';

export const useVoiceToText = () => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const startVoiceRecognition = () => {
    resetTranscript();
    // You can adjust the options; here continuous is false so recording stops after a pause.
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopVoiceRecognition = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    startVoiceRecognition,
    stopVoiceRecognition,
  };
};