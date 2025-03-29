import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PatientIdInput({ value, onChange, error }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="patientId">
        Patient ID
      </Label>
      <Input
        id="patientId"
        value={value}
        onChange={onChange}
        placeholder="Enter patient ID number"
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}