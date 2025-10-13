import { useEffect } from 'react';


const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    // This function will be called on any click in the document.
    const handleClickOutside = (event) => {
      // The core logic: if the referenced element exists and the click
      // did not happen inside it, then call the callback function.
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    // Add the event listener to the document when the component mounts.
    document.addEventListener("mousedown", handleClickOutside);

    // This is a cleanup function. It runs when the component unmounts
    // to prevent memory leaks by removing the event listener.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]); // Re-run the effect only if the ref or callback changes.
};

export default useOutsideClick;
// /////////////////////////////////////////////////////////////////////////////////////////////q/////////////////////