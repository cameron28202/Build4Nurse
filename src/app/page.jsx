"use client";

import React, { useState, useEffect } from 'react';
import VitalCard from "@/components/VitalCard";
import SummaryCard from '@/components/SummaryCard';
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
            // move to next vital
            setCurrentVital(vitals[currentIndex + 1]);
            setIsLoading(false);
        } else {
            // last vital? send data
            try {
                // create vitals array
                const vitalsArray = [
                    parseFloat(vitalsData.temperature),
                    parseFloat(vitalsData.heartRate),
                    parseFloat(vitalsData.respiratoryRate),
                    parseFloat(vitalsData.systolicPressure),
                    parseFloat(vitalsData.diastolicPressure),
                    parseFloat(vitalsData.o2Sat), 
                    parseFloat(value) // glucose
                ];
                
                // Send data to FHIR server
                const result = await api.sendVitalsForPatient(vitalsData.patientId, vitalsArray);
                
                if(result.success){
                    setApiStatus({ message: "Vitals submitted successfully!", isError: false });
                } 
                else {
                    setApiStatus({ message: `Error: ${result.error}`, isError: true });
                }
            } 
            catch (error) {
                console.error("Error submitting vitals:", error);
                setApiStatus({ 
                    message: "Failed to submit vitals. Please try again.", 
                    isError: true 
                });
            }
            
            // move to summary regardless if corrects
            setCurrentVital({ id: "summary", title: "Summary", instruction: "Review of recorded vitals" });
            setIsLoading(false);
        }
    };

    // reset vitals and go back home
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
                            <SummaryCard 
                                vitalsData={vitalsData}
                                apiStatus={apiStatus}
                                handleBackToHome={handleBackToHome}
                            />
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