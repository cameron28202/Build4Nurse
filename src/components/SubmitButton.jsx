import { Button } from "@/components/ui/button";

export default function SubmitButton({ 
  isLoading = false, 
  loadingText = "Loading...", 
  text = "Submit", 
  onClick,
  type = "submit",
  variant = "default",
  className = "",
  disabled = false
}) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      variant={variant}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  );
}