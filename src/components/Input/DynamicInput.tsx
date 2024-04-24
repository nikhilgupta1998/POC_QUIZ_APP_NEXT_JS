"use client";
import React, { useState, useRef, KeyboardEvent } from "react";

interface DynamicInputProps {
  length: number;
  questionId: string | number;
  onSubmit: (answer: string, questionId: string | number) => void;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
  length,
  questionId,
  onSubmit,
}) => {
  const [inputValues, setInputValues] = useState<string[]>(
    Array(length).fill(""),
  );
  const inputRefs = Array.from({ length }, () =>
    useRef<HTMLInputElement>(null),
  );

  const handleChange = (index: number, value: string) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && index > 0 && !inputValues[index]) {
      // Handle backspace
      const newInputValues = [...inputValues];
      newInputValues[index - 1] = "";
      setInputValues(newInputValues);
      if (inputRefs[index - 1].current) {
        inputRefs[index - 1]?.current?.focus();
      }
    } else if (
      event.key.length === 1 &&
      index < length - 1 &&
      inputRefs[index + 1].current
    ) {
      // Move to the next input box for other keys
      setTimeout(() => {
        inputRefs[index + 1]?.current?.focus();
      }, 0);
    }
  };
  const handleSubmit = () => {
    // Join the input values into a single string
    const answer = inputValues.join("");
    // Call the onSubmit callback with the answer
    onSubmit(answer, questionId);
    // Clear input values for next question
    setInputValues(Array(length).fill(""));
    // Focus on the first input box after submission
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex flex-wrap gap-4">
        {inputValues?.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={value}
            className="w-12 rounded border-[1.5px] border-stroke bg-transparent px-3 py-3 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={inputRefs[index]}
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        type="button"
        className="mt-5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
      >
        Save
      </button>
    </div>
  );
};

export default DynamicInput;
