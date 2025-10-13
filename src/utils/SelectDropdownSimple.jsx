import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { OutsideClick } from './OutsideClick';
import { TableViewSkeletonDropdown } from './common/TableViewSkeleton';

const  SelectDropdownSimple = React.forwardRef(
  ({
    selectedValue,
    options,
    placeholder,
    onSelect,
    searchPlaceholder = 'Search...',
    handleSearch,
    type,
    loading = false,
    showSearchBar,
    className,
    disabled = false,
    itemClassName = () => '', // Pass a function to add custom classes conditionally
    selectedName = ''
  }, ref
  ) => {

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const searchInputRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);
    // const selectDropdown = OutsideClick();

    // ✅ 2. Focus the input when dropdown opens
    useEffect(() => {
      if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen]);

    // Close dropdown when clicked outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item) => {
      if (
        type === "department" ||
        type === "designation" ||
        type === "country" ||
        type === "state" ||
        type === "city" ||
        type === "employee" ||
        type === "shift" ||
        type === "status" ||
        type === "client" ||
        type === "leave_type" ||
        type === "user_id" ||
        type === "requested_to" ||
        type === "traniner" ||
        type === "work_location"
      ) {
        onSelect(type, item?.id);
      }
      else if (type === "role") {
        onSelect(type, item);
      }
      else {
        onSelect(type, item?.name);
      }
      setIsOpen(false);
    };

    const handleSearchItem = (e) => {
      setSearchQuery(e.target.value);
      handleSearch(e.target.value, type)
    }

    // const selectedItem = (
    //   type === "department" ||
    //   type === "designation" ||
    //   type === "country" ||
    //   type === "state" ||
    //   type === "city" ||
    //   type === "employee" ||
    //   type === "shift" ||
    //   type === "status" ||
    //   type === "client" ||
    //   type === "leave_type" ||
    //   type === "user_id" ||
    //   type === "requested_to" ||
    //   type === "traniner" ||
    //   type === "work_location" ||
    //   type === "role"
    // )
    // ? options.find((item) => item?.id === selectedValue) : options.find((item) => item?.name === selectedValue);

    // Get the selected item name based on the selected ID or selected Name
    const selectedItem = options?.find((item) => item?.id === selectedValue || item?.name === selectedValue || item?.value === selectedValue);
    const displayValue = selectedName ? selectedName : selectedItem ? selectedItem?.name : placeholder;

    // const filteredOptions = options?.filter((option) => option?.name?.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      // <div className={`dropdown ${className || ''}`}> {/* Apply className here */}
      //   <div className="dropdown-button" ref={buttonRef} onClick={toggleDropdown}>
      //     <div>{displayValue}</div>
      //     <span id="toggle_selectIcon">
      //       {!isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
      //     </span>
      //   </div>
      <div className={`dropdown ${className || ''} ${disabled ? 'dropdown-disabled' : ''}`} ref={ref} tabIndex={0}>
        <div className={`dropdown-button ${disabled ? 'disabled' : ''}`} ref={buttonRef} onClick={toggleDropdown}>
          <div>{displayValue}</div>
          <span id="toggle_selectIcon">
            {!isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
          </span>
        </div>

        {(isOpen && !disabled) && (
          <div className="dropdown-menu" ref={dropdownRef}>
            {showSearchBar &&
              <input
                id="searchDepartmentHead"
                type="search"
                className="search22"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchItem}
                autoComplete="off"
                ref={searchInputRef}
              />
            }
            {(loading) ? <>
              <TableViewSkeletonDropdown />
            </>
              :

              <div className="dropdown_I">
                {/* {options?.map((item, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(item)}
              >
                {item?.name}
              </div>
            ))} */}
                {options?.map((item, index) => {
                  const itemClasses = `dropdown-item ${itemClassName(item)}`; // Apply conditional classes
                  return (
                    <div
                      key={index}
                      className={itemClasses}
                      onClick={() => !itemClasses.includes('disabled') && handleSelect(item)} // Prevent selection if item is disabled
                    >
                      {item?.name}
                    </div>
                  );
                })}
                {options?.length === 0 && (
                  <>
                    <div className="no_option_found">
                      <iframe
                        src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                        frameBorder="0"
                      ></iframe>
                    </div>
                    <div className="dropdown-item centeraligntext">No option found</div>
                  </>
                )}
                {/* Show an option to add a new item if no options match */}
                {/* {options?.length === 0 && searchQuery && (
              <div
                className="dropdown-item add-new"
                onClick={() => handleSelect(searchQuery)}
              >
                + "{searchQuery}"
              </div>
            )} */}
              </div>
            }
          </div>
        )}
      </div>
    );
  }
);

export default SelectDropdownSimple;
