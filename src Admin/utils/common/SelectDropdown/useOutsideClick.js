// useOutsideClick.js
import { useEffect } from "react";

const useOutsideClick = (mainRef, callback, ignoreRef) => {
  useEffect(() => {
    const handleClickOutside = (event) => {

      // Ignore if clicked inside ignoreRef (e.g. button)
      if (ignoreRef?.current && ignoreRef.current.contains(event.target)) {
        return;
      }

      // Trigger callback if clicked outside mainRef
      if (mainRef?.current && !mainRef.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mainRef, ignoreRef, callback]);
};

export default useOutsideClick;
