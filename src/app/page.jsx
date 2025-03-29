"use client";

import { useState } from "react";
import renderCurrentStep from "@/service/renderCurrentStep";

export default function Home() {
  const [currentStep, setCurrentStep] = useState("patientId");
  const [vitalsData, setVitalsData] = useState({
    patientId: "",
    temperature: "",
    weight: "",
    bloodPressure: "",
    heartRate: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleVitalSubmit = (vitalType, value) => {
    setIsLoading(true);
    
    // Simulate API call to EPIC
    setTimeout(() => {
      // Update vitals data
      setVitalsData(prev => ({
        ...prev,
        [vitalType]: value
      }));
      
      // Move to next step
      const steps = ["patientId", "temperature", "weight", "bloodPressure", "heartRate", "summary"];
      const currentIndex = steps.indexOf(currentStep);
      
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1]);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Build4Nurse</h1>
            <p className="text-gray-600">Voice-enabled documentation for nurses</p>
          </div>
          
          {/* progress bar indicator? */}
          
          {/* Render the current step */}
          {renderCurrentStep({
            currentStep,
            handleVitalSubmit,
            isLoading
          })}
        </div>
      </main>
    </div>
  );
}