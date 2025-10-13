import React, { useRef } from 'react';
import { IoIosCheckmark } from 'react-icons/io';
import { TableViewSkeletonDropdown } from '../TableViewSkeleton';
import { CircleArrowDown, Plus, Search, X } from 'lucide-react';
import './SelectDropdown.scss';
import useDropdownHelper from './useDropdownHelper';
import { clearSearchParams, getSearchParams, setSearchParams } from '../../helper';

const SelectDropdown = React.forwardRef(
  ({
    selectedValue,
    options = [],
    placeholder = '',
    onSelect,
    searchPlaceholder = 'Search...',
    handleSearch = () => { },
    type,
    loading = false,
    showSearchBar = false,
    className = "",
    disabled = false,
    itemClassName = () => '', // Pass a function to add custom classes conditionally
    selectedName = '',
    debounceDelay = 800, // ✅ configurable debounce delay
    searchMode = "remote",
    size,
    showAddButton = false,
    onAddClick,
    addBtnText = ""
  }, ref
  ) => {
    const {
      isOpen, setIsOpen, searchTerm, setSearchTerm, dropdownRef,
      inputRef, handleKeyDown, handleSelect, focusedOptionIndex, filteredOptions, optionRefs
    } = useDropdownHelper(options, onSelect, type, searchMode);

    const buttonRef = useRef(null);
    const debounceTimeoutRef = useRef(null); // ✅ local debounce ref

    // Combine internal dropdownRef with forwarded ref
    const combinedRef = (node) => {
      dropdownRef.current = node; // Set internal dropdownRef
      if (ref) ref.current = node; // Set forwarded ref
    };

    const toggleDropdown = () => {
      if (!isOpen) {
        setSearchTerm("");
        const storedParams = getSearchParams(type);;
        if (storedParams?.search) {
          handleSearch("", type);
          clearSearchParams(type);
        }
      }
      setIsOpen(!isOpen);
    };

    const handleSelectOption = (item) => {
      handleSelect(item);
      setSearchTerm("");
    };

    // ✅ Debounced search handler
    const handleSearchItem = (e) => {
      const query = e.target.value;
      setSearchTerm(query);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (handleSearch) {
          const params = {};
          if (query?.length > 0) {
            params.search = query;
            setSearchParams(type, params);
          }
          else {
            clearSearchParams(type);
          }
          handleSearch(query, type);
        }
      }, debounceDelay);
    };

    // Get the selected item name based on the selected ID or selected Label
    const selectedItem = options?.find((item) => item?.id == selectedValue || item?.label == selectedValue);
    // console.log("selectedItem", selectedItem);
    const displayValue = selectedItem?.label ?? selectedName ?? placeholder;
    // console.log("selectedName", selectedName);
    const isPlaceholder = !selectedName && !selectedItem;

    return (
      <div ref={combinedRef} className={`dropdown ${size === 'md' ? 'sizemd' : ''} ${className || ''} ${disabled ? 'dropdown-disabled' : ''}`} tabIndex={0} onKeyDown={handleKeyDown}>
        <div className={`dropdown-button ${disabled ? 'disabled disabled-dropdown-menu' : ''}`} ref={buttonRef} onClick={toggleDropdown}>
          <div className={`${isPlaceholder ? 'Isplaceholder' : ''}`}>{displayValue}</div>

          {!disabled &&
            <span id="toggle_selectIcon">
              {!isOpen ? <CircleArrowDown strokeWidth={1.3} /> : <CircleArrowDown strokeWidth={1.3} />}
            </span>
          }
        </div>

        {(isOpen && !disabled) && (
          <div className={`dropdown-menu `} ref={dropdownRef}>
            {showSearchBar &&
              <>
                <Search className='Search_icon' size={20} strokeWidth={1.5} />
                <input
                  id="searchDepartmentHead"
                  type="search"
                  className="search22"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={handleSearchItem}
                  autoComplete="off"
                  ref={inputRef}
                />
              </>
            }
            {(loading) ? <>
              <TableViewSkeletonDropdown />
            </>
              :
              <div className="dropdown_I">
                {filteredOptions?.map((item, index) => {
                  const isSelected = selectedItem?.id == item?.id || selectedItem?.label == item?.label;
                  const itemClasses = `dropdown-item ${itemClassName(item)} ${isSelected ? 'selected-option' : ''} ${(index === focusedOptionIndex ? " focusedoption" : "")}`;
                  return (
                    <div
                      key={index}
                      ref={el => {
                        if (optionRefs?.current) {
                          optionRefs.current[index] = el;
                        }
                      }}
                      className={itemClasses}
                      tabIndex={-1}
                      onClick={() => !itemClasses.includes('disabled') && handleSelectOption(item)}
                    >
                      <span>{item?.label}</span>
                      {isSelected && <IoIosCheckmark size={28} className="check-icon" />}
                    </div>
                  );
                })}
                {filteredOptions?.length === 0 && (
                  <>
                    <div className="no_option_found">
                      <iframe
                        src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json"
                        frameBorder="0"
                      ></iframe>
                    </div>
                    <div style={{ paddingBottom: '10px' }} className=" centeraligntext">No option found</div>
                  </>
                )}
              </div>

            }
            {/* ✅ Add this section */}
            {showAddButton && (
              <div
                className="add-button"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the dropdown from closing immediately
                  onAddClick();
                  setIsOpen(false)
                }}
              >
                <span>
                  <Plus size={16} className='ssvvgg' /> Add {addBtnText}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default SelectDropdown;
