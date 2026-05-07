// Styles
import "./FormInput.css";

const FormInput = ({ type, name, placeholder, value, onChange, touched, error }) => {
  return (
    <div className="form-group">
      <input
        className={`form-input${touched && error ? " has-error" : ""}`}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {touched && error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default FormInput;
