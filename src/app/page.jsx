"use client";

import { useState } from "react";
import PatientIdInput from "@/components/PatientIdInput";
import SubmitButton from "@/components/SubmitButton";

export default function Home() {
  const [patientId, setPatientId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientId.trim()) {
      setError("Please enter a valid patient ID");
      return;
    }

  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Build4Nurse</h1>
            <p className="text-gray-600">Voice-enabled documentation for nurses</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <PatientIdInput 
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              error={error}
            />

            <SubmitButton 
                isLoading={false}
                text="Find Patient" 
                loadingText="Searching..."
            />

          </form>
        </div>
      </main>
    </div>
  );
}