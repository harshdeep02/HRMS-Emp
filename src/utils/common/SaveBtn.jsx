import LoadingButton from './LoadingButton'

function SaveBtn({ viewMode, loading, color, handleSubmit, btntype, isDisabled }) {
    return (
        <div className={`btn_fix_box _btn_fix_box_2 ${btntype}`}>
            <div className={`${loading ? 'btn_saveed_disabled' : ''} `}>
                <button className="dept-page-action-btn" onClick={handleSubmit} disabled={isDisabled}>
                    {loading ?
                        <LoadingButton loading={loading} color={color} />
                        :
                        (viewMode === 'add' ? 'SAVE' : 'UPDATE')}
                </button>
            </div>
        </div>
    )
}

export default SaveBtn
