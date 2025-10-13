import { CircleArrowLeft, CircleArrowRight, Clock } from "lucide-react";
import { CiCircleChevRight } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const LoadingButton = ({ loading, color = 'grey', editingIndex, handleSubmit, handleCancel }) => {
    return (
        <>
            {loading ? (
                <div id='svg_submit_loading' style={{overflow:'hidden'}} >
                    <svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 105">
                        <circle fill={color} cx="10" cy="50" r="7">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1" />
                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                        </circle>
                        <circle fill={color} cx="35" cy="50" r="7">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2" />
                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                        </circle>
                        <circle fill={color} cx="60" cy="50" r="7">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" />
                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                        </circle>
                        <circle fill={color} cx="85" cy="50" r="7">
                            <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4" />
                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                        </circle>
                    </svg>
                </div>
            ) : (
                <></>
            )}

        </>
    );
};

export default LoadingButton;
