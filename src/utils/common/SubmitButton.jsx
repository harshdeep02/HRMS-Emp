import { CircleArrowLeft, CircleArrowRight, Clock } from "lucide-react";
import { CiCircleChevRight } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";
import LoadingButton from "./LoadingButton";

const SubmitButton = ({ loading, id, handleSubmit }) => {
    return (
        <div className="btn_fix_box ">

        <div id='submitBtn_next_main'>

            <div id='submitBtn'>
                <div className='div'>

                    <>
                        {/* {activeFormIndex < 4 && */}
                        <div className="form">
                            <button type="button" className='next' onClick={handleSubmit} style={{height: '44px'}}>
                                {/* <Clock size={16} strokeWidth={1.5} />  */}
                                {loading ? (
                                    <LoadingButton loading={true} color='#fff' />
                                ) : (
                                    <>
                                        {id ? "Update" : "Save"}
                                    </>
                                )}
                            </button>
                        </div>
                        {/* } */}
                    </>

                    {/* {!loading && <span><CiCircleChevRight /></span>} */}
                </div>
            </div>


        </div>
        </div>
    );
};

export default SubmitButton;
