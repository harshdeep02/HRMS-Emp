import { useRef, useState, useMemo, useEffect } from "react";
import useOutsideClick from "../../../components/common/hooks/useOutsideClick";
import { ChevronDown, Search } from "lucide-react";
import Tooltips from "../Tooltip/Tooltips";

export const CustomDropdown = ({
    arrow = true,
    title,
    disabled = false,
    icon,
    options = [],
    selectedValue,
    onValueChange,
    renderButton,
    rightSideDropdwon,
    cl,
    cls,
    setIsDynamicFilter
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setIsOpen(false));

     useEffect(() => {
    setIsDynamicFilter && setIsDynamicFilter(isOpen);
    }, [isOpen]);

    const handleSelect = (value) => {
        onValueChange(value);
        setIsOpen(false);
        setSearchTerm(""); // reset search after select
    };
    const selectedItem = options?.find(
        (item) => item?.label === selectedValue || item?.value === selectedValue
    );
    const displayValue = selectedItem ? selectedItem?.label : "";

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, options]);

    return (
        <div className={`custom-dropdown ${cls} ${rightSideDropdwon ? 'rightSideDropdwon' : ''}`} ref={dropdownRef}>
            <Tooltips title={title || ''} placement="top" arrow={true}>
                <div
                    className={`dropdown-trigger  ${cl}`}
                    onClick={!disabled ? () => setIsOpen(!isOpen) : undefined}
                >
                    {icon}
                    {renderButton(displayValue)}
                    {arrow && !disabled && (
                        <ChevronDown
                            size={16}
                            className={`chevron-icon ${isOpen ? "open" : ""}`}
                        />
                    )}
                </div>
            </Tooltips>

            {isOpen && (
                <>

                    <ul className="dropdown-panel">
                        {options.length > 10 && (
                            <>
                                <Search className='Search_icon_' size={20} strokeWidth={1.5} />
                                <input
                                    id="searchDepartmentHead_"
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="dropdown-search-input"
                                    autoFocus
                                />
                            </>
                        )}

                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option?.value}
                                    // onClick={() => handleSelect(option?.value)}
                                    onClick={() => {
                                        if (option?.value !== selectedValue) handleSelect(option?.value);
                                    }}
                                    className={`dropdown_item_dis ${selectedValue === option?.value ? "selected" : ""}`}
                                >
                                    {icon && option?.icon && (
                                        <span className="option-icon">
                                            <option.icon size={16} strokeWidth={1.5} />
                                        </span>
                                    )}
                                    {option?.label}
                                </li>
                            ))
                        ) : (
                            <>
                                <div className="no_option_found">
                                    <iframe
                                        src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                                        frameBorder="0"
                                    ></iframe>
                                    <div className="centeraligntext">No option found</div>
                                </div>
                            </>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};
