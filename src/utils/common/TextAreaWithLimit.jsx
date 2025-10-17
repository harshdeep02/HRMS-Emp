const TextAreaWithLimit = ({ formsValues, disabled, placeholder, name, value }) => {
    const charCount = value ? value?.trim()?.length : 0;
    const handleChange = formsValues?.handleChange

    return (
        <div>
            <textarea
                placeholder={placeholder}
                value={value == 0 ? "" : value}
                onChange={handleChange}
                name={name}
                maxLength={300}
                disabled={disabled}
            />
            <p>{charCount}/300</p>
        </div>
    );
};

export default TextAreaWithLimit;