// Styles
import "./FormInput.css";

const FormInput = ({
  error,
  name,
  onBlur,
  onChange,
  options = [],
  placeholder,
  touched,
  type,
  value,
}) => {
  const inputClassName = `form-input${touched && error ? " has-error" : ""}`;

  return (
    <div className="form-group">
      {type === "select" ? (
        <select
          className={inputClassName}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={inputClassName}
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
      {touched && error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormInput;
