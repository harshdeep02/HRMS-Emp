import { useState, useRef, useEffect } from 'react';
import useOutsideClick from './useOutsideClick';

const useDropdownHelper = (options, onSelect, type, searchMode) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [focusedOptionIndex, setFocusedOptionIndex] = useState(-1);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const optionRefs = useRef([]);
    // const filteredOptions = options;

    // ✅ Decide filtering based on searchMode
    const filteredOptions = searchMode === "local" ?
        options?.filter(option =>
            option?.label?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options; // for "remote" just show API options

    const handleSelect = (selectedOption) => {
        if (selectedOption.active === "0") return;
        onSelect(type, selectedOption);
        setIsOpen(false);
        setSearchTerm(""); // clear input search after selection
        setFocusedOptionIndex(-1);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === "ArrowDown") setIsOpen(true);
            return;
        }
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setFocusedOptionIndex((prevIndex) => {
                    let next = prevIndex;
                    do {
                        next = next < filteredOptions.length - 1 ? next + 1 : 0;
                    } while (filteredOptions[next]?.active === "0" && next !== prevIndex);
                    optionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    return next;
                });
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedOptionIndex((prevIndex) => {
                    let next = prevIndex;
                    do {
                        next = next > 0 ? next - 1 : filteredOptions.length - 1;
                    } while (filteredOptions[next]?.active === "0" && next !== prevIndex);
                    optionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    return next;
                });
                break;
            case 'Enter':
                if (focusedOptionIndex >= 0) {
                    const selected = filteredOptions[focusedOptionIndex];
                    if (selected?.active !== "0") handleSelect(selected);
                }
                break;
            case 'Escape':
            case 'Tab':
                setIsOpen(!isOpen);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setFocusedOptionIndex(-1);
        }
    }, [isOpen]);

    // ✅ 2. Focus the input when dropdown opens
    // useEffect(() => {
    //     if (isOpen && inputRef.current) {
    //         inputRef.current.focus();
    //         // setFocusedOptionIndex(-1);
    //     }
    // }, [isOpen]);

    // Close dropdown when clicked outside
    useOutsideClick(dropdownRef, () => setIsOpen(false));

    return {
        isOpen,
        setIsOpen,
        searchTerm,
        setSearchTerm,
        focusedOptionIndex,
        dropdownRef,
        inputRef,
        handleKeyDown,
        handleSelect,
        filteredOptions,
        optionRefs
    };
};

export default useDropdownHelper;