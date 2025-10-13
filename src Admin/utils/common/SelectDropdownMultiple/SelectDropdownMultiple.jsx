import React, { useRef } from 'react';
import { IoIosCheckmark } from 'react-icons/io';
import { TableViewSkeletonDropdown } from '../TableViewSkeleton';
import { CircleArrowDown, Plus, Search } from 'lucide-react';
import './SelectDropdownMultiple.scss';
import useDropdownHelper from './useDropdownHelper';
import { clearSearchParams, getSearchParams, setSearchParams } from '../../helper';

const SelectDropdownMultiple = React.forwardRef(
  ({
    selectedValue,
    needLabel,
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
    itemClassName = () => '',
    selectedName = '',
    multiple = true, // Set to false by default, pass true for multi-select
    debounceDelay = 800,
    searchMode = "remote",
    showAddButton = false,
    onAddClick,
    addBtnText = ""
  }, ref) => {
    // --- THIS IS THE CORRECTED LINE ---
    // We now pass `selectedValue` to the hook so it knows what is currently selected.
    const {
      isOpen, setIsOpen, searchTerm, setSearchTerm, dropdownRef,
      inputRef, handleKeyDown, focusedOptionIndex, filteredOptions, optionRefs
    } = useDropdownHelper(options, onSelect, { type, multiple, selectedValue }, searchMode);
    const buttonRef = useRef(null);
    const combinedRef = (node) => {
      dropdownRef.current = node;
      if (ref) ref.current = node;
    };

    const toggleDropdown = () => {
      if (!isOpen) {
        setSearchTerm("");
        const storedParams = getSearchParams(type);
        if (storedParams?.search) {
          handleSearch("", type);
          clearSearchParams(type);
        }
      }
      setIsOpen(!isOpen);
    };

    // This function now correctly uses the handleSelect from the hook for all logic
    // --- THIS IS THE CORRECTED LOGIC ---
    // We will write our own selection logic here instead of using the one from the hook.
    const handleSelectOption = (item) => {
      let newSelectedValue;
      if (multiple) {
        if (needLabel) {
          // selection based on label
          if (selectedValue?.includes(item.label)) {
            //remove item
            newSelectedValue = selectedValue.filter(label => label !== item.label);
          } else {
            newSelectedValue = [...(selectedValue || []), item.label];
          }
        } else {
          // selection based on id
          if (selectedValue?.includes(item.id)) {
            //remove item
            newSelectedValue = selectedValue.filter(id => id !== item.id);
          } else {
            newSelectedValue = [...(selectedValue || []), item.id];
          }
        }
        onSelect(newSelectedValue);
      } else {
        onSelect(item);
        setIsOpen(false);
      }
    };
    const debounceTimeoutRef = useRef(null); // ✅ local debounce ref

    const handleSearchItem = (e) => {
      const query = e.target.value;
      setSearchTerm(query);

      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Start debounce
      debounceTimeoutRef.current = setTimeout(() => {
        if (handleSearch) {
          if (query?.length > 0) {
            const params = { search: query };
            setSearchParams(type, params);
          } else {
            clearSearchParams(type);
          }
          handleSearch(query, type);
        }
      }, debounceDelay);
    };

    const getDisplayValue = () => {
      if (multiple) {
        if (needLabel) {
          if (!selectedValue || selectedValue.length === 0) return placeholder;
          const selectedOptions = options?.filter(opt => selectedValue.includes(opt.label));
          // if (selectedOptions.length === 1) return selectedOptions[0].label;
          // return `${selectedOptions?.length} ${type}`;
          return selectedOptions.map(opt => opt.label).join(", ");
        }
        else {
          if (!selectedValue || selectedValue.length === 0) return placeholder;
          const selectedOptions = options?.filter(opt => selectedValue.includes(opt.id));
          // if (selectedOptions.length === 1) return selectedOptions[0].label;
          // return `${selectedOptions?.length} ${type}`;
          return selectedOptions.map(opt => opt.label).join(", ");
        }
      }
      const selectedItem = options?.find((item) => item?.id == selectedValue || item?.label == selectedValue);
      return selectedName ? selectedName : selectedItem ? selectedItem.label : placeholder;
    };

    const displayValue = getDisplayValue();
    const isPlaceholder = displayValue === placeholder;

    return (
      <div ref={combinedRef} className={`dropdown_SelectDropdownMultiple ${className || ''} ${disabled ? 'dropdown-disabled' : ''}`} tabIndex={0} onKeyDown={handleKeyDown}>
        <div className={`dropdown-button ${disabled ? 'disabled' : ''}`} ref={buttonRef} onClick={toggleDropdown}>
          <div className={`${isPlaceholder ? 'Isplaceholder' : ''}`}>{displayValue}</div>
          {!disabled &&
            <span id="toggle_selectIcon">
              <CircleArrowDown strokeWidth={1.3} className={`arrow-icon ${isOpen ? 'open' : ''}`} />
            </span>
          }
        </div>
        {(isOpen && !disabled) && (
          <div className="dropdown-menu">
            {showSearchBar && (
              <div className="search-bar-wrapper">
                <Search className='Search_icon' size={20} strokeWidth={1.5} />
                <input
                  id="searchDepartmentHead" type="search" className="search22"
                  placeholder={searchPlaceholder}
                  value={searchTerm} onChange={handleSearchItem}
                  autoComplete="off" ref={inputRef} />
              </div>
            )}
            {loading ? <TableViewSkeletonDropdown /> : (
              <div className="dropdown_I">
                {filteredOptions?.map((item, index) => {
                  let isSelected;
                  if (multiple) {
                    isSelected = Array.isArray(selectedValue) && needLabel ? selectedValue?.includes(item?.label) : selectedValue.includes(item.id);
                  } else {
                    const selectedItem = options?.find((sItem) => sItem?.id == selectedValue || sItem?.label == selectedValue);
                    isSelected = selectedItem?.id == item?.id || selectedItem?.label == item?.label;
                  }
                  const itemClasses = `dropdown-item ${multiple ? 'multiple' : ''} ${itemClassName(item)} ${isSelected ? 'selected-option' : ''} ${(index === focusedOptionIndex ? " focusedoption" : "")}`;
                  return (
                    <div
                      key={item.id || index}
                      ref={el => { if (optionRefs?.current) { optionRefs.current[index] = el; } }}
                      className={itemClasses}
                      tabIndex={-1}
                      onClick={() => !itemClasses.includes('disabled') && handleSelectOption(item)}>
                      {multiple && (
                        <div className={`checkbox-icon ${isSelected ? 'checked' : ''}`}>
                          {isSelected && <IoIosCheckmark className='checkedIcon' size={20} color='white' />}
                        </div>
                      )}
                      <div className={`lable__ ${isSelected ? 'selected-option-lable' : ''}`}>{item?.label}</div>
                      {!multiple && isSelected && <IoIosCheckmark size={28} className="check-icon" />}
                    </div>
                  );
                })}
                {filteredOptions?.length === 0 && (
                  <div className="no-options-container">
                    <div className="no_option_found">
                      <iframe src="https://lottie.host/embed/4a834d37-85a4-4cb7-b357-21123d50c03a/JV0IcupZ9W.json" frameBorder="0"></iframe>
                    </div>
                    <div className="centeraligntext">No option found</div>
                  </div>
                )}
              </div>
            )}
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

export default SelectDropdownMultiple;
