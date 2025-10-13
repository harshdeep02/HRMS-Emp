// CompetencySelector.jsx
import React from "react";
import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";

const competencyOptions = [
	{ id: "advance", label: "Advance" },
	{ id: "intermediate", label: "Intermediate" },
	{ id: "expert", label: "Expert" },
];

const CompetencySelector = ({ name, label, value, onSelect, disabled }) => {
	const selectedItem = competencyOptions.find((item) => item.id === value);

	return (
		<div className="form-grid-layout">
			<div className="dept-page-input-group performance_status_form">
				<div className="dept-page-icon-wrapper lable_ps">
					{/* <CreditCard size={20} strokeWidth={1.5} /> */}
				<label className="">{label}</label>
				</div>
				<SelectDropdown
					options={competencyOptions}
					onSelect={(selectedName, item) => onSelect(name, item)}
					type={name}
					disabled={disabled}
					selectedName={selectedItem?.label || "Select"}
					selectedValue={value}
					size="md"
				/>
			</div>
		</div>
	);
};

export default CompetencySelector;
