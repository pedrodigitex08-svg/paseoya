import React from "react";

export function CurrencyInput({ value, onChange, ...props }) {
  const handleChange = (e) => {
    // Only allow digits
    const rawValue = e.target.value.replace(/\D/g, "");
    
    // Create a fake event object to maintain compatibility with standard onChange handlers
    const fakeEvent = {
      target: {
        name: props.name,
        value: rawValue ? parseInt(rawValue, 10) : ""
      }
    };
    
    if (onChange) {
      onChange(fakeEvent);
    }
  };

  // Format the value with dots for thousands (es-CO standard)
  const formattedValue = (value !== null && value !== undefined && value !== "") 
    ? Number(value).toLocaleString("es-CO") 
    : "";

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={formattedValue}
      onChange={handleChange}
    />
  );
}
