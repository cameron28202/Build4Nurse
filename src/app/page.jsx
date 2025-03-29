"use client";

import { useState, useEffect } from "react";
import renderCurrentStep from "@/service/renderCurrentStep";
import Header from "@/components/Header";
import Image from "next/image";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [currentStep, setCurrentStep] = useState("landing");
  const [vitalsData, setVitalsData] = useState({
    patientId: "",
    temperature: "",
    weight: "",
    bloodPressure: "",
    heartRate: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  
  // Trigger initial fade-in when component mounts
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);
  
  // Trigger fade-in/out on step change
  useEffect(() => {
    setFadeIn(false);
    setTimeout(() => {
      setFadeIn(true);
    }, 300);
  }, [currentStep]);

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

  const startApplication = () => {
    setCurrentStep("patientId");
  };

  return (
    <div className="min-h-screen relative">
      {/* Background image with opacity */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/nurse-background.jpg" 
          alt="Nurse background" 
          fill
          sizes="100vw"
          priority
          className="opacity-20 object-cover" 
        />
      </div>
      
      {/* Content */}
      <Header/>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 min-h-screen">
        <div className="max-w-md w-full">
          {/* Render landing or current step with fade animation */}
          <div 
            className={`transition-opacity duration-500 ease-in-out ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {currentStep === "landing" ? (
              <LandingPage onGetStarted={startApplication} />
            ) : (
              <div className="backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                {renderCurrentStep({
                  currentStep,
                  handleVitalSubmit,
                  isLoading,
                  vitalsData
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}