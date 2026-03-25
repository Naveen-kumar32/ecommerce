const FormInput = ({ type, name, placeholder, value, onChange, touched, error }) => {
  return (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {touched && error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
};

export default FormInput;
