import { CustomDropdown } from "./CustomDropdownListPage/CustomDropdown";
import { useSelector } from "react-redux";

const FILTER_CONFIG = {
  department: {
    label: "Departments",
    selector: (state) => state?.allDepartments?.data?.department || [],
    map: (item) => ({ value: item?.id, label: item?.department_name })
  },
  job_role: {
    label: "Job Roles",
    selector: (state) => state?.jobList?.data?.job_opening || [],
    map: (item) => ({ value: item?.id, label: item?.job_title })
  },
  priority: {
    label: "Priority",
    selector: () => [], // no redux needed, options will always come from parent
    map: (item) => item // parent already provides { value, label }
  },
  leave_type: {
    label: "Leave Type",
    selector: () => [], // no redux needed, options will always come from parent
    map: (item) => item // parent already provides { value, label }
  },
  org_type: {
    label: "Organization Type",
    selector: () => [], // no redux needed, options will always come from parent
    map: (item) => item // parent already provides { value, label }
  },
  status: {
    label: "Status",
    selector: () => [], // no redux needed, options will always come from parent
    map: (item) => item // parent already provides { value, label }
  },
  filter: {
    label: "Filter",
    selector: () => [], // no redux needed, options will always come from parent
    map: (item) => item // parent already provides { value, label }
  }
};

const DynamicFilter = ({
  filterValue,
  onChange,
  filterBy = "filter",
  rightSideDropdwon,
  options = []
}) => {
  console.log("options", options)
  const config = FILTER_CONFIG[filterBy] || FILTER_CONFIG.department;

  // Get redux data
  const reduxData = useSelector(config.selector);

  // Map redux data → dropdown options
  const reduxOptions = reduxData?.map(config.map);

  // Add "All" option
  const defaultOption = { value: "All", label: `All ${config.label}` };

  // Decide which options to render
  const finalOptions = options?.length > 0 ? [defaultOption, ...options] : [defaultOption, ...reduxOptions];

  return (
    <CustomDropdown
      options={finalOptions}
      selectedValue={filterValue}
      onValueChange={onChange}
      rightSideDropdwon={rightSideDropdwon}
      renderButton={(value) => {
        const isActive = value !== "All" && value !== defaultOption.label;
        return (
          <span
            style={{
              color: isActive ? "#9542D9" : "", // active pe purple, otherwise black
            }}
          >
            {value === "All" || value === defaultOption.label ? config.label : value}
          </span>
        );
      }}
    />
  );
};

export default DynamicFilter;
