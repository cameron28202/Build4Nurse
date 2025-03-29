// components/LandingPage.jsx
import { Button } from "@/components/ui/button";

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="flex flex-col items-center text-center space-y-8">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl max-w-md">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">Build4Nurse</h1>
        <p className="text-xl text-gray-700 mb-6">
          Giving nurses more time for what matters most - patient care.
        </p>
        <p className="text-gray-600 mb-8">
          Voice-enabled vital signs documentation that integrates seamlessly with EPIC.
          Reduce paperwork and increase time with patients.
        </p>
        <Button 
          onClick={onGetStarted} 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}