import { Parentheses, AppWindowMac, UserStar } from "lucide-react";
import "./DepartmentDetail.scss";
import {useSelector } from "react-redux";

const DepartmentForm = ({ formData}) => {

	//Data from redux
	const createUpdateDepartment = useSelector(
		(state) => state?.createDepartment
	);
	const depHeadData = useSelector((state) => state?.employeeList);
	const depHeadList = depHeadData?.data?.result || [];

	const departmentDetails = useSelector((state) => state?.departmentDetails);
	const departmentDetail = departmentDetails?.data?.department;

	const parentDepData = useSelector((state) => state?.departmentList);
	const parentDepLists = parentDepData?.data?.department || [];

	return (
		<>
			<div
				className={`dept-page-basic-info-section`}>
				{/* <h3>Basic Information</h3>
				<p className="dept-page-subtitle">Basic profile overview</p> */}
				<div className="form-grid-layout">

					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<AppWindowMac size={20} strokeWidth={1.5} />
						</div>
						<label>
							Department Name
						</label>
						<input
							type="text"
							name="department_name"
							value={formData?.department_name}
							disabled={true}
						/>
					</div>
					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<Parentheses size={20} strokeWidth={1.5} />
						</div>
						<label>Parent Department</label>
						<input
							type="text"
							name="parent_department"
							value={formData?.parent_department}
							disabled={true}
						/>
					</div>
					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<UserStar size={20} strokeWidth={1.5} />
						</div>
						<label >
							Department Head
						</label>
						<input
							type="text"
							name="department_head"
							value={formData?.department_head}
							disabled={true}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DepartmentForm;
