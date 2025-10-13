import React from 'react';
import './Stepper.scss';

const Stepper = ({ steps, activeIndex, onStepClick, filledForms }) => {
  return (
    <div className="stepper-container">
      {steps.map((step, index) => {
        const isClickable = index === 0 || Object.values(filledForms).slice(0, index).every(Boolean);
        const isActive = index === activeIndex;
        const isFilled = filledForms[step.title];

        return (
          <div
            key={index}
            className={`step ${isActive ? 'active' : ''} ${isFilled ? 'filled' : ''} ${!isClickable ? 'disabled' : ''}`}
            onClick={() => isClickable && onStepClick(index)}
          >
            <div className="step-circle">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="step-labels">
              <div className="step-number">Step {index + 1}</div>
              <div className="step-title">{step.title}</div>
              {isFilled && <p className='title_Completed'>Completed</p>}
            </div>
            {index !== steps.length - 1 && <div className="step-line"></div>}
            
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
