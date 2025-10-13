import { Users, Building2, Parentheses, AppWindowMac, UserStar } from "lucide-react";
import "./DepartmentDetail.scss";
import SelectDropdown from "../../../../utils/common/SelectDropdown/SelectDropdown.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useRef, useState } from "react";
import SaveBtn from "../../../../utils/common/SaveBtn.jsx";
import { toast } from "react-toastify";
import { handleFormError } from "../../../../utils/helper.js";
import {
	createNewDepartment,
	getDepartmentDetails,
} from "../../../../Redux/Actions/departmentActions.js";
import { useNavigate, useParams } from "react-router-dom";

const DepartmentForm = ({ viewMode, formData, setFormData, handleSearch }) => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();

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

	const departmentOptions = useMemo(
		() =>
			parentDepLists?.map((d) => ({ id: d?.id, label: d?.department_name })),
		[parentDepLists]
	);

	const headOptions = useMemo(
		() =>
			depHeadList?.map((e) => ({
				id: e?.employee?.user_id,
				label: [e?.employee?.first_name, e?.employee?.last_name]
					.filter(Boolean)
					.join(" "),
			})),
		[depHeadList]
	);

	const department_name_ref = useRef(null);
	const department_head_ref = useRef(null);

	const [errors, setErrors] = useState({
		department_name: false,
		department_head: false,
	});

	const basicRequiredFields = [
		{
			key: "department_name",
			label: "Please fill Name",
			required: true,
			ref: department_name_ref,
		},
		{
			key: "department_head",
			label: "Please select Department Head",
			required: true,
			ref: department_head_ref,
		},
	];

	const handleSelect = (name, item) => {
		setFormData((prevData) => ({
			...prevData,
			[name]: item?.id,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: false,
		}));
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
		// Update only basicDetails errors
		setErrors((prevState) => ({
			...prevState,
			[name]: false, // Clear error for this field
		}));
	};

	// const validateForm = () => {
	//     let hasError = false;
	//     const newErrors = {};

	//     for (let field of basicRequiredFields) {
	//         // Single field validation
	//         const value = formData[field.key];
	//         const isEmpty = !value || (typeof value === "string" && value.trim() === "");
	//         newErrors[field.key] = isEmpty ? field.label : false;
	//         if (field.required && isEmpty) {
	//             toast.error(`${field.label}`);
	//             hasError = true;
	//         }
	//     }
	//     setErrors((prev) => ({
	//         ...prev,
	//         ...newErrors,
	//     }));
	//     return !hasError;
	// };

	const validateForm = () => {
		for (let field of basicRequiredFields) {
			const value = formData[field.key];
			if (
				field.required &&
				(!value || (typeof value === "string" && !value.trim()))
			) {
				setErrors((prev) => ({ ...prev, [field.key]: field.label }));
				toast.error(field.label);
				handleFormError(field?.ref);
				return false;
			}
		}
		return true;
	};

	const handleSaveOrUpdate = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		const formDataToSubmit = {
			...formData,
		};
		if (viewMode === "edit") {
			formDataToSubmit["id"] = id;
		}
		dispatch(createNewDepartment(formDataToSubmit))
			.then((res) => {
				if (res?.status === 200) {
					navigate(
						id
							? `/department-details/${id}`
							: `/department-list`
					);
					if (id) {
						dispatch(getDepartmentDetails({ id }));
					}
				}
			})
			.catch((error) => {
				console.log("error-", error);
			});
	};

	return (
		<>
			<div
				className={`dept-page-basic-info-section ${viewMode === "edit" ? "isEditPage" : ""}`}>
				{/* <h3>Basic Information</h3>
				<p className="dept-page-subtitle">Basic profile overview</p> */}
				<div className="form-grid-layout">

					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<AppWindowMac size={20} strokeWidth={1.5} />
						</div>
						<label className={viewMode !== "detail" ? "color_red" : ""}>
							Department Name
							{viewMode !== "detail" && <b className="color_red">*</b>}
						</label>
						<input
							ref={department_name_ref}
							type="text"
							name="department_name"
							value={formData?.department_name}
							onChange={handleChange}
							disabled={viewMode === "detail"}
						/>
					</div>
					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<Parentheses size={20} strokeWidth={1.5} />
						</div>
						<label>Parent Department</label>
						<SelectDropdown
							selectedValue={formData?.parent_department}
							options={departmentOptions}
							// placeholder="Select Department"
							onSelect={handleSelect}
							searchPlaceholder="Search department"
							handleSearch={handleSearch}
							type="parent_department"
							loading={parentDepData?.loading}
							showSearchBar={true}
							isEditMode={viewMode == "edit"}
							disabled={viewMode === "detail"}
							selectedName={
								viewMode === "detail"
									? departmentDetail?.parent_department?.department_name
									: ""
							}
						/>
					</div>
					<div className="dept-page-input-group">
						<div className="dept-page-icon-wrapper">
							<UserStar size={20} strokeWidth={1.5} />
						</div>
						<label className={viewMode !== "detail" ? "color_red" : ""}>
							Department Head
							{viewMode !== "detail" && <b className="color_red">*</b>}
						</label>
						<SelectDropdown
							ref={department_head_ref}
							selectedValue={formData?.department_head}
							options={headOptions}
							// placeholder="Select Department Head"
							onSelect={handleSelect}
							searchPlaceholder="Search head of Department"
							handleSearch={handleSearch}
							type="department_head"
							loading={depHeadData?.loading}
							showSearchBar={true}
							disabled={viewMode === "detail"}
							selectedName={
								viewMode === "detail"
									? [
										departmentDetail?.department_head?.first_name,
										departmentDetail?.department_head?.last_name,
									]
										.filter(Boolean)
										.join(" ")
									: ""
							}
						/>
					</div>
				</div>
			</div>
			{(viewMode === "add" || viewMode === "edit") && (
				<SaveBtn
					handleSubmit={handleSaveOrUpdate}
					viewMode={viewMode}
					loading={createUpdateDepartment?.loading}
					color="#fff"
					btntype='buttom_fix_btn'
				/>
			)}
		</>
	);
};

export default DepartmentForm;
