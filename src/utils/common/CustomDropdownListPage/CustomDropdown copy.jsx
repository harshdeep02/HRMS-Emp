import { useRef, useState } from "react";
import useOutsideClick from "../../../components/common/hooks/useOutsideClick";
import { ChevronDown } from "lucide-react";
import Tooltips from "../Tooltip/Tooltips";

export const CustomDropdown = ({ arrow = true,title, icon, options, selectedValue, onValueChange, renderButton }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useOutsideClick(dropdownRef, () => setIsOpen(false));

    const handleSelect = (value) => {
        onValueChange(value);
        setIsOpen(false);
    };
    const selectedItem = options?.find((item) => item?.label === selectedValue || item?.value === selectedValue);
    const displayValue = selectedItem ? selectedItem?.label : "";

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <Tooltips
                title={title || ''}
                placement="top" arrow={true}
            >

                <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                    {icon}
                    {renderButton(displayValue)}
                    {arrow &&
                        <ChevronDown size={16} className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                    }
                </div>
            </Tooltips>
            {isOpen && (
                <ul className="dropdown-panel">
                    {options?.map((option) => (
                        <li key={option?.value} onClick={() => handleSelect(option?.value)} className={selectedValue === option?.value ? 'selected' : ''}>
                            {option?.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
