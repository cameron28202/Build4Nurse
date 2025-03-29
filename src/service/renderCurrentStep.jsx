import VitalCard from '@/components/VitalCard';

export default function renderCurrentStep({ 
    currentStep,
    handleVitalSubmit,
    isLoading
  }){

    switch(currentStep){
        case "patientId":
            return (
                <VitalCard
                    id="patientId"
                    title="Patient ID"
                    placeholder="Enter patient ID number"
                    instruction="Please enter or scan the patient's ID"
                    onSubmit={(value) => handleVitalSubmit("patientId", value)}
                    isLoading={isLoading}
                    buttonText="Find Patient"
                    loadingText="Searching..."
                />
            );
        case "temperature":
            return (
                <VitalCard
                    id="temperature"
                    title="Temperature"
                    placeholder="Enter temperature (e.g., 98.6)"
                    instruction="Please record the patient's temperature"
                    onSubmit={(value) => handleVitalSubmit("temperature", value)}
                    isLoading={isLoading}
                />
            );
        case "weight":
            return (
                <VitalCard
                    id="weight"
                    title="Weight"
                    placeholder="Enter weight in pounds"
                    instruction="Please record the patient's weight"
                    onSubmit={(value) => handleVitalSubmit("weight", value)}
                    isLoading={isLoading}
                />
            );
        case "bloodPressure":
            return (
                <VitalCard
                    id="bloodPressure"
                    title="Blood Pressure"
                    placeholder="Enter as systolic/diastolic (e.g., 120/80)"
                    instruction="Please record the patient's blood pressure"
                    onSubmit={(value) => handleVitalSubmit("bloodPressure", value)}
                    isLoading={isLoading}
                />
            );
        case "heartRate":
            return (
                <VitalCard
                    id="heartRate"
                    title="Heart Rate"
                    placeholder="Enter beats per minute"
                    instruction="Please record the patient's heart rate"
                    onSubmit={(value) => handleVitalSubmit("heartRate", value)}
                    isLoading={isLoading}
                />
            );
        default:
            return (
                <div>Unknown step</div>
            )
    }
}