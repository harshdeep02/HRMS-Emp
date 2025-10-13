import { CustomDropdown } from "./CustomDropdownListPage/CustomDropdown.jsx";
import { Funnel } from "lucide-react";

const SortFilter = ({ sortBy, onChange, options = [] }) => {

    const sortOptions = [
        { value: 'recent', label: 'Recently Added' },
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
        { value: 'last-7-days', label: 'Last 7 days' },
        { value: 'last-month', label: 'Last Month' },
    ];

    // Decide which options to use → parent or redux
    const finalOptions = options?.length > 0 ? options : sortOptions;
    const isActive = sortBy !== "recent";

    return (
        <CustomDropdown
            title="Filter"
            icon={<Funnel  color={isActive ? "#9542D9" : "#000"} size={20} strokeWidth={isActive ? 2 : 1.25} />}
            arrow={false}
            options={finalOptions}
            selectedValue={sortBy}
            onValueChange={onChange}
            renderButton={(value) => (
                <span>
                    {/* {finalOptions?.find((o) => o?.value === value)?.label || "Sort"} */}
                </span>
            )}
        />
    );
};

export default SortFilter;
