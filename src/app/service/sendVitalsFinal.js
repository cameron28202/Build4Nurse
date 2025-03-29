
// LOINC vital definitions in the right order
const vitalDefinitions = [
  { code: "8310-5", display: "Body temperature", unit: "°F" },
  { code: "8867-4", display: "Heart rate", unit: "bpm" },
  { code: "9279-1", display: "Respiratory rate", unit: "breaths/min" },
  { code: "8480-6", display: "Systolic Blood Pressure", unit: "mmHg" },
  { code: "8462-4", display: "Diastolic Blood Pressure", unit: "mmHg" },
  { code: "59408-5", display: "Oxygen saturation", unit: "%" },
  { code: "15074-8", display: "Glucose [Mass/volume] in Blood", unit: "mg/dL" }
];

// Try to find patient with given ID
const checkPatientExists = async (patientId) => {
  const res = await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`);
  return res.ok;
};

// Send one observation
const sendVital = async ({ patientId, code, display, value, unit }) => {
  const timestamp = new Date().toISOString();

  const observation = {
    resourceType: "Observation",
    status: "final",
    category: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/observation-category",
        code: "vital-signs"
      }]
    }],
    code: {
      coding: [{
        system: "http://loinc.org",
        code,
        display
      }]
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    effectiveDateTime: timestamp,
    valueQuantity: {
      value,
      unit
    }
  };

  const res = await fetch("https://hapi.fhir.org/baseR4/Observation", {
    method: "POST",
    headers: { "Content-Type": "application/fhir+json" },
    body: JSON.stringify(observation)
  });

  const result = await res.json();
  if (!res.ok) throw new Error(`❌ Failed to send ${display}: ${JSON.stringify(result)}`);
  console.log(`✅ ${display}: ${value} ${unit} at ${timestamp}`);
};

// Main function to process incoming vitals
async function sendVitalsForPatient(patientId, vitalsArray) {
  try {
    if (vitalsArray.length !== vitalDefinitions.length) {
        throw new Error("❌ Invalid vitals array length.");
    }

    const exists = await checkPatientExists(patientId);
    if (!exists) {
        throw new Error(`❌ Patient ID "${patientId}" does not exist on the server.`);
    }

    for (let i = 0; i < vitalsArray.length; i++) {
      const value = vitalsArray[i];
      if (value === -1) continue;

      const { code, display, unit } = vitalDefinitions[i];
      await sendVital({ patientId, code, display, value, unit });
    }

    console.log("🎯 All valid vitals sent!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

module.exports = { sendVitalsForPatient };