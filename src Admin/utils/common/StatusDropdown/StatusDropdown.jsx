import { useEffect, useState } from "react";
import "./StatusDropdown.scss";
import { CustomDropdown } from "../CustomDropdownListPage/CustomDropdown";

const StatusDropdown = ({ options = [], defaultValue, onChange, disabled }) => {

  // const [selected, setSelected] = useState(defaultValue);

  // useEffect(() => {
  //   setSelected(defaultValue);
  // }, [defaultValue]);

  const handleChange = (value) => {
    // setSelected(value);
    onChange?.(value);
  };

  const processedOptions = options?.map(opt => ({
  ...opt,
  disabled: opt?.value === defaultValue, // add disabled flag
}));

  // Find the label for the currently selected value
  const selectedLabel = options?.find(option => option?.value === defaultValue)?.label || '';

  return (
    <div className={`status-dropdown status-${selectedLabel?.toLowerCase().replace(" ", "-")}`}>
      <CustomDropdown
        options={processedOptions}
        selectedValue={defaultValue}
        onValueChange={handleChange}
        renderButton={(label) => (
          <span className={`status-label status-${label.toLowerCase().replace(" ", "-")}`}>
            <span className="status-dot"></span>
            {label}
          </span>
        )}
        arrow={true}
        icon={true}
        cl='status_dropdown'
        cls='min_dropdown'
        disabled={disabled}
      />
    </div>
  );
};

export default StatusDropdown;