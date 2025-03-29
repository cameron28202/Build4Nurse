import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InputContainer({ 
  id,
  label,
  value, 
  onChange, 
  error,
  placeholder,
  type = "text"
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}