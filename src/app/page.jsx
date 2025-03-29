"use client";

import React, { useState, useEffect } from 'react';
import VitalCard from "@/components/VitalCard";
import api from "@/service/api";

import './page.css';

const Home = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showVitals, setShowVitals] = useState(false);
    const [currentVital, setCurrentVital] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState({ message: "", isError: false });
    const [vitalsData, setVitalsData] = useState({
        patientId: "",
        temperature: "",
        heartRate: "",
        respiratoryRate: "",
        systolicPressure: "",
        diastolicPressure: "",
        o2Sat: "",
        glucose: ""
    });

    // fade in effect
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1 
        });

        document.querySelectorAll('.hidden').forEach(element => {
            observer.observe(element);
        });

        return () => {
            document.querySelectorAll('.hidden').forEach(element => {
                observer.unobserve(element);
            });
        };
    }, [showVitals]); 

    const features = [
        {
            title: "Real-time Vitals Tracking",
            description: "Easily record and monitor patient vitals in real-time, ensuring you always have the most up-to-date information for better clinical decision-making.",
            icon: "❤️"
        },
        {
            title: "Streamlined Workflow",
            description: "Save valuable time with our intuitive interface designed specifically for busy nurses to record vitals quickly and accurately, reducing administrative burden.",
            icon: "⏱️"
        },
        {
            title: "Improved Patient Care",
            description: "Focus more on your patients by spending less time on paperwork, ultimately enhancing the quality of care you provide and improving patient outcomes.",
            icon: "🏥"
        }
    ];

    const vitals = [
        {
            id: "patientId",
            title: "Patient ID",
            placeholder: "Enter patient ID",
            instruction: "Enter the patient's identification number."
        },
        {
            id: "temperature",
            title: "Temperature",
            placeholder: "98.6",
            instruction: "Record the patient's body temperature in Fahrenheit."
        },
        {
            id: "heartRate",
            title: "Heart Rate",
            placeholder: "72",
            instruction: "Record the patient's heart rate in beats per minute."
        },
        {
            id: "respiratoryRate",
            title: "Respiratory Rate",
            placeholder: "16",
            instruction: "Record the patient's respiratory rate in breaths per minute."
        },
        {
            id: "systolicPressure",
            title: "Systolic Pressure",
            placeholder: "120",
            instruction: "Record the patient's systolic blood pressure in mmHg."
        },
        {
            id: "diastolicPressure",
            title: "Diastolic Pressure",
            placeholder: "80",
            instruction: "Record the patient's diastolic blood pressure in mmHg."
        },
        {
            id: "o2Sat",
            title: "Oxygen Saturation",
            placeholder: "98",
            instruction: "Record the patient's oxygen saturation as a percentage."
        },
        {
            id: "glucose",
            title: "Glucose",
            placeholder: "100",
            instruction: "Record the patient's blood glucose level in mg/dL."
        }
    ];

    const handleGetStarted = () => {
        setShowVitals(true);
        setCurrentVital(vitals[0]);
    };

    const handleVitalSubmit = async (value) => {
        setIsLoading(true);
        
        // Update vitalsData with current value
        setVitalsData(prev => ({
            ...prev,
            [currentVital.id]: value
        }));
        
        // Find current vital index
        const currentIndex = vitals.findIndex(v => v.id === currentVital.id);
        
        if (currentIndex < vitals.length - 1) {
            // Move to next vital
            setCurrentVital(vitals[currentIndex + 1]);
            setIsLoading(false);
        } else {
            // This is the last vital - send data to FHIR server
            try {
                // Create array of vital values in the correct order for the API
                const vitalsArray = [
                    parseFloat(vitalsData.temperature),
                    parseFloat(vitalsData.heartRate),
                    parseFloat(vitalsData.respiratoryRate),
                    parseFloat(vitalsData.systolicPressure),
                    parseFloat(vitalsData.diastolicPressure),
                    parseFloat(vitalsData.o2Sat), 
                    parseFloat(value) // glucose (current value)
                ];
                
                // Send data to FHIR server
                const result = await api.sendVitalsForPatient(vitalsData.patientId, vitalsArray);
                
                if (result.success) {
                    setApiStatus({ message: "Vitals submitted successfully!", isError: false });
                } else {
                    setApiStatus({ message: `Error: ${result.error}`, isError: true });
                }
            } catch (error) {
                console.error("Error submitting vitals:", error);
                setApiStatus({ 
                    message: "Failed to submit vitals. Please try again.", 
                    isError: true 
                });
            }
            
            // Move to summary regardless of API success
            setCurrentVital({ id: "summary", title: "Summary", instruction: "Review of recorded vitals" });
            setIsLoading(false);
        }
    };

    // Handle when user wants to go back to home from summary
    const handleBackToHome = () => {
        setShowVitals(false);
        setCurrentVital(null);
        setApiStatus({ message: "", isError: false });
        // Reset vitals data for next session
        setVitalsData({
            patientId: "",
            temperature: "",
            heartRate: "",
            respiratoryRate: "",
            systolicPressure: "",
            diastolicPressure: "",
            o2Sat: "",
            glucose: ""
        });
    };

    // Render summary component
    const renderSummary = () => {
        return (
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-4">Patient Vitals Summary</h2>
                
                {apiStatus.message && (
                    <div className={`p-3 mb-4 rounded-md ${apiStatus.isError 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-green-100 text-green-700 border border-green-300'}`}>
                        {apiStatus.message}
                    </div>
                )}
                
                <div className="space-y-2">
                    <p><span className="font-medium">Patient ID:</span> {vitalsData.patientId}</p>
                    <p><span className="font-medium">Temperature:</span> {vitalsData.temperature} °F</p>
                    <p><span className="font-medium">Heart Rate:</span> {vitalsData.heartRate} bpm</p>
                    <p><span className="font-medium">Respiratory Rate:</span> {vitalsData.respiratoryRate} breaths/min</p>
                    <p><span className="font-medium">Blood Pressure:</span> {vitalsData.systolicPressure}/{vitalsData.diastolicPressure} mmHg</p>
                    <p><span className="font-medium">O₂ Saturation:</span> {vitalsData.o2Sat}%</p>
                    <p><span className="font-medium">Glucose:</span> {vitalsData.glucose} mg/dL</p>
                </div>
                <div className="mt-6">
                    <button 
                        onClick={handleBackToHome}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                    >
                        Complete and Return to Home
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="home">
            {!showVitals ? (
                <>
                    <section className="hero">
                        <h1>Welcome to Build4Nurse</h1>
                        <p className="mission">Enhancing patient care by simplifying vitals tracking for nurses</p>
                        <button onClick={handleGetStarted} className="cta-button">Get Started</button>
                    </section>

                    <section className="features">
                        <h2 className="features-title">How Build4Nurse Helps You</h2>
                        <div className="features-container">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`feature hidden ${activeFeature === index ? 'active' : ''}`}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                    onMouseEnter={() => setActiveFeature(index)}
                                    onMouseLeave={() => setActiveFeature(null)}
                                >
                                    <div className="feature-icon">{feature.icon}</div>
                                    <h2>{feature.title}</h2>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleGetStarted} className="cta-button hidden" style={{ animationDelay: '0.6s' }}>
                            Start Tracking
                        </button>
                    </section>
                </>
            ) : (
                <div className="vitals-container">
                    <div className="vitals-card">
                        <h1 className="text-center text-2xl font-bold mb-6 text-blue-600">Patient Vitals Tracking</h1>
                        
                        {currentVital && currentVital.id === "summary" ? (
                            renderSummary()
                        ) : (
                            currentVital && (
                                <VitalCard
                                    id={currentVital.id}
                                    title={currentVital.title}
                                    placeholder={currentVital.placeholder}
                                    instruction={currentVital.instruction}
                                    onSubmit={handleVitalSubmit}
                                    isLoading={isLoading}
                                    buttonText="Save and Continue"
                                    loadingText="Saving..."
                                />
                            )
                        )}
                        
                        {currentVital && currentVital.id !== "summary" && (
                            <div className="mt-4 text-center">
                                <button 
                                    onClick={handleBackToHome} 
                                    className="text-blue-600 hover:underline"
                                >
                                    Back to Home
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;