"use client";

import { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import InputContainer from "@/components/InputContainer";
import SubmitButton from "@/components/SubmitButton";

export default function VitalCard({ 
  id,
  title,
  placeholder,
  instruction,
  onSubmit,
  isLoading,
  buttonText = "Save and Continue",
  loadingText = "Saving..."
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  // Text-to-speech confirmation helper
  const speakConfirmation = (message) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submission logic
  const submitValue = () => {
    if (!value.trim()) {
      setError(`Please enter a valid ${title.toLowerCase()}`);
      speakConfirmation(`Error: Please enter a valid ${title.toLowerCase()}`);
      return;
    }
    setError("");
    onSubmit(value);
    speakConfirmation(`${title} submitted successfully`);
  };

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  /**
   * Process voice commands:
   * - "Skip" sets the value to "-1", submits, and speaks confirmation.
   * - "Submit" submits the current input.
   * - "Pause" stops listening and confirms pausing.
   * - "Clear" clears the input and confirms the action.
   * - "Start" restarts listening and confirms.
   */
  useEffect(() => {
    if (!transcript) return;

    let newValue = transcript;
    const lower = transcript.toLowerCase();

    // "Skip" -> Set value to "-1" and submit
    if (lower.includes("skip")) {
      newValue = newValue.replace(/skip/gi, "");
      setValue("-1");
      speakConfirmation(`${title} skipped`);
      submitValue();
      resetTranscript();
      return;
    }

    // "Submit" -> Submit the current text
    if (lower.includes("submit")) {
      newValue = newValue.replace(/submit/gi, "");
      setValue(newValue.trim());
      submitValue();
      resetTranscript();
      return;
    }

    // "Pause" -> Stop listening
    if (lower.includes("pause")) {
      newValue = newValue.replace(/pause/gi, "");
      SpeechRecognition.stopListening();
      speakConfirmation(`Voice recognition paused`);
      // Continue processing to update input if needed.
    }

    // "Clear" -> Clear the input
    if (lower.includes("clear")) {
      newValue = newValue.replace(/clear/gi, "");
      setValue("");
      resetTranscript();
      speakConfirmation(`Cleared input`);
      return;
    }

    // "Start" -> Start listening again
    if (lower.includes("start")) {
      newValue = newValue.replace(/start/gi, "");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      speakConfirmation(`Voice recognition restarted`);
      return;
    }

    // If no command (or after handling "pause"), update the input text.
    setValue(newValue.trim());
  }, [transcript]);

  // Manual start/stop handlers
  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    speakConfirmation(`Started recording`);
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    speakConfirmation(`Stopped recording`);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    submitValue();
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Sorry, your browser does not support Speech Recognition.</p>;
  }

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-white">
      <h2 className="text-xl font-medium mb-3">{title}</h2>
      {instruction && <p className="text-gray-600 mb-4">{instruction}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <InputContainer
          id={id}
          label={title}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          error={error}
        />

        <div className="mt-4 space-x-2">
          <button
            type="button"
            onClick={handleStartRecording}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            {listening ? "Recording..." : "Start Recording"}
          </button>
          <button
            type="button"
            onClick={handleStopRecording}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Stop Recording
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Voice Commands: "Clear", "Submit", "Skip", "Pause", "Start"
          </p>
        </div>

        <SubmitButton 
          isLoading={isLoading}
          text={buttonText}
          loadingText={loadingText}
        />
      </form>
    </div>
  );
}
