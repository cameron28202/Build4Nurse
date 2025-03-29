export default function SummaryCard({ 
  vitalsData,
  apiStatus,
  handleBackToHome
}) {
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
                All done! Record Again
            </button>
        </div>
    </div>
  );
}