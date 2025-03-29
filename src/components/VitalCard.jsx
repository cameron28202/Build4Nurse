"use client";

import { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) {
      setError(`Please enter a valid ${title.toLowerCase()}`);
      return;
    }
    
    setError("");
    onSubmit(value);
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

        <SubmitButton 
          isLoading={isLoading}
          text={buttonText}
          loadingText={loadingText}
        />
      </form>
    </div>
  );
}