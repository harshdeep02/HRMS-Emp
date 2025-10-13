import React from "react";
import "./Stepper.scss";
import { FaCheck } from "react-icons/fa";

const Stepper = ({ steps, activeIndex }) => {
  return (
    <div className="stepper-wrapper">
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;

        return (
          <div className="step-block" key={index}>
            {/* Circle */}
            <div
              className={`circle ${isCompleted ? "completed" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              {isCompleted ? <FaCheck size={10} /> : ""}
            </div>

            {/* Title */}
            <div
              className={`title ${isCompleted || isActive ? "active-title" : ""}`}
            >
              {step.title}
            </div>

            {/* Line */}
            {index !== steps.length - 1 && (
              <div
                className={`line ${isCompleted ? "completed" : ""} ${
                  isActive ? "active" : ""
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
