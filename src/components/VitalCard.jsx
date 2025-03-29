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

  // Core submission logic extracted for reuse.
  const submitValue = () => {
    if (!value.trim()) {
      setError(`Please enter a valid ${title.toLowerCase()}`);
      return;
    }
    setError("");
    onSubmit(value);
  };

  // Define voice commands.
  const commands = [
    {
      command: "Clear the line",
      callback: () => {
        setValue("");
        resetTranscript();
      },
    },
    {
      command: "Submit the value",
      callback: () => {
        submitValue();
        resetTranscript();
      },
    },
  ];

  // Set up speech recognition with the commands.
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } =
    useSpeechRecognition({ commands });

  // While recording, update the input with the live transcript.
  useEffect(() => {
    if (listening) {
      setValue(transcript);
    }
  }, [transcript, listening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitValue();
  };

  const handleStartRecording = () => {
    resetTranscript();
    // Using continuous mode so that voice commands work while recording.
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
  };

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

        {browserSupportsSpeechRecognition && (
          <div className="mt-4 space-x-2">
            <button
              type="button"
              onClick={handleStartRecording}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
            >
              {listening ? "Recording..." : "Start Recording"}
            </button>
            <button
              type="button"
              onClick={handleStopRecording}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
            >
              Stop Recording
            </button>
          </div>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Voice Commands: "Clear the line", "Submit the value"
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
