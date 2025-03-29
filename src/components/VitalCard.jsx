"use client";

import { useState, useEffect, useRef } from "react";
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

  // Text-to-speech confirmation helper.
  // This version will only be used on submission.
  const speakConfirmation = (message) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submission logic.
  // When submission is successful, it will speak the current metric title along with its value.
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
   * Process voice commands:
   * - "Skip" sets the value to "-1" and submits.
   * - "Submit" submits the current input.
   * - "Pause" stops listening.
   * - "Clear" clears the input.
   * - "Start" restarts listening.
   *
   * Note: Only "Submit" and "Skip" lead to submission,
   * which then triggers the text-to-speech confirmation.
   */
  useEffect(() => {
    if (!transcript) return;

    let newValue = transcript;
    const lower = transcript.toLowerCase();

    if (lower.includes("skip")) {
      newValue = newValue.replace(/skip/gi, "");
      setValue("-1");
      submitValue();
      resetTranscript();
      return;
    }

    if (lower.includes("enter")) {
      newValue = newValue.replace(/submit/gi, "");
      setValue(newValue.trim());
      submitValue();
      setValue("");
      resetTranscript();
      return;
    }

    if (lower.includes("pause")) {
      newValue = newValue.replace(/pause/gi, "");
      SpeechRecognition.stopListening();
    }

    if (lower.includes("clear")) {
      newValue = newValue.replace(/clear/gi, "");
      setValue("");
      resetTranscript();
      return;
    }

    if (lower.includes("start")) {
      newValue = newValue.replace(/start/gi, "");
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      return;
    }

    setValue(newValue.trim());
  }, [transcript]);

  // --- New: Speak the title once for the current metric ---
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    // Reset the flag when the title changes (i.e. a new metric)
    hasSpokenRef.current = false;
  }, [title]);

  useEffect(() => {
    if (!hasSpokenRef.current) {
      // Speak the title once and set the flag to true.
      speakConfirmation(title);
      hasSpokenRef.current = true;
    }
  }, [title]);

  // Manual start/stop handlers.
  const handleStartRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
  };

  // Form submission.
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
