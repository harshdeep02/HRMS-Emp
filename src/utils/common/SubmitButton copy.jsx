import { CircleArrowLeft, CircleArrowRight, Clock } from "lucide-react";
import { CiCircleChevRight } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

const SubmitButton = ({ loading, id, handleSubmit }) => {
    return (
        <div id='submitBtn_next_main'>

            <div id='submitBtn'>
                <div className='div'>
                    {loading ? (
                        <div id='svg_submit_loading'>
                            <svg version="1.1" id="L5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <circle fill="#fff" cx="10" cy="50" r="7">
                                    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 15 ; 0 -15; 0 15" repeatCount="indefinite" begin="0.1" />
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                </circle>
                                <circle fill="#fff" cx="35" cy="50" r="7">
                                    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 10 ; 0 -10; 0 10" repeatCount="indefinite" begin="0.2" />
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                </circle>
                                <circle fill="#fff" cx="60" cy="50" r="7">
                                    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.3" />
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                </circle>
                                <circle fill="#fff" cx="85" cy="50" r="7">
                                    <animateTransform attributeName="transform" dur="1s" type="translate" values="0 5 ; 0 -5; 0 5" repeatCount="indefinite" begin="0.4" />
                                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                </circle>
                            </svg>
                        </div>
                    ) : (
                        <>
                            {/* {activeFormIndex < 4 && */}
                            <div className="form">
                                <button type="button" className='next' onClick={handleSubmit}>
                                    {/* <Clock size={16} strokeWidth={1.5} />  */}
                                    {id ? "Update" : "Save"}
                                </button>
                            </div>
                            {/* } */}
                        </>
                    )}
                    {/* {!loading && <span><CiCircleChevRight /></span>} */}
                </div>
            </div>


        </div>
    );
};

export default SubmitButton;
