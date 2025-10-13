import SelectDropdown from "../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import { showMasterData } from "../../../utils/helper.js";


const CompetencySelector = ({ name, label, value, onSelect, disabled }) => {

	const performance_level = showMasterData("25");
	const getMessage = (val) => {
		if (val === "Expert" || val === 3) return "Good Performance";          // Expert
		if (val === "Advance" || val === 2) return "Average Performance";    // Advance
		if (val === "Intermediate" || val === 1) return "Low Performance"; // Intermediate
		return "";
	};

	return (
		<div className="form-grid-layout ">
			<div className="dept-page-input-group performance_status_form">
				<div className="dept-page-icon-wrapper lable_ps">
					<label className="">{label}</label>
				</div>
				<SelectDropdown
					selectedValue={value}
					options={performance_level}
					onSelect={(name, item) => onSelect(name, item)}
					type={name}
					disabled={disabled}
					selectedName={
						performance_level?.find(
							item => item?.id == value || item?.label == value
						)?.label || "Select"
					}
					size="md"
				/>
				<div className="meritDes_">{getMessage(value)}</div>
			</div>
		</div>
	);
};

export default CompetencySelector;
