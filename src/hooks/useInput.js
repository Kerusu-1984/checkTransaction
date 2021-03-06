import { useState } from "react";

export const useInput = (defaultValue, isValid) => {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [valueIsValid, setValueIsValid] = useState(true);
  const setValue = (value) => {
    setValueIsValid(isValid(value));
    setEnteredValue(value);
  };
  const validateHandler = () => {
    const enteredValueIsValid = isValid(enteredValue);
    setValueIsValid(enteredValueIsValid);
    return enteredValueIsValid;
  };
  return {
    value: enteredValue,
    setValue,
    isValid: valueIsValid,
    validateHandler,
  };
};
