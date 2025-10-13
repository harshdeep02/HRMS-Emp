import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Search } from "lucide-react";

export const useDebounceSearch = (callback, delay) => {
    const debounceTimeout = useRef(null);

    const debouncedFunction = (...args) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return debouncedFunction;
};

const SearchBox = forwardRef(
    (
        {
            onSearch = () => { },
            placeholder = "Search...",
            delay = 1000,
        },
        ref
    ) => {

        const [searchTerm, setSearchTerm] = useState('');
        const [prevLength, setPrevLength] = useState(0);

        const debouncedSearch = useDebounceSearch((term) => {
            onSearch(term.trim());
        }, delay);

        const handleChange = (e) => {
            const term = e.target.value;
            setSearchTerm(term);
            debouncedSearch(term); // Always debounced, even when clearing
        };

        // const handleChange = (e) => {
        //     const term = e.target.value;
        //     setSearchTerm(term);

        //     const currentLength = term.length;
        //     setPrevLength(currentLength);

        //     if (term.length > 0) {
        //         debouncedSearch(term); // ✅ pass latest term directly
        //     } else if (
        //         (term.length === 0 && prevLength === 1) ||
        //         (prevLength - term.length > 1)
        //     ) {
        //         onSearch(''); // ✅ trigger with empty search
        //     }
        // };

        // Function to handle search when the icon is clicked
        const searchItems = () => {
            onSearch(searchTerm.trim()); // ✅ use latest state
        };

        // Allow parent to call clearInput
        useImperativeHandle(ref, () => ({
            clearInput: () => {
                setSearchTerm("");
            },
        }));

        return (
            <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    autoComplete="off"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleChange}
                    onInput={handleChange}
                />
            </div>
        );
    });

export default SearchBox;
