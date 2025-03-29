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

  // Submission logic
  const submitValue = () => {
    if (!value.trim()) {
      setError(`Please enter a valid ${title.toLowerCase()}`);
      return;
    }
    setError("");
    onSubmit(value);
  };

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript
  } = useSpeechRecognition();

  /**
   * 1) Check the transcript for any command words.
   * 2) If a command word is found, do the associated action.
   * 3) Remove that command word from the text so it doesn't appear in the input.
   * 4) "Return" after certain commands so they don't conflict with each other.
   */
  useEffect(() => {
    if (!transcript) return;

    // We'll remove command words from newValue before updating the input.
    let newValue = transcript;
    const lower = transcript.toLowerCase();

    // "Skip" -> Set the value to "-1" and submit
    if (lower.includes("skip")) {
      newValue = newValue.replace(/skip/gi, "");
      setValue("-1");
      submitValue();
      resetTranscript();
      return; // Exit so we don't process multiple commands in one phrase
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
      // We do NOT return here, so the final cleaned text is set below.
    }

    // "Clear" -> Clear the input
    if (lower.includes("clear")) {
      newValue = newValue.replace(/clear/gi, "");
      setValue("");
      resetTranscript();
      return;
    }

    // "Start" -> Start listening again
    if (lower.includes("start")) {
      newValue = newValue.replace(/start/gi, "");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      return;
    }

    // If no command (or after removing "pause"), update the input text.
    setValue(newValue.trim());
  }, [transcript]);

  // Manual start/stop
  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
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
