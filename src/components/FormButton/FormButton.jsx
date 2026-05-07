// Styles
import "./FormButton.css";

const FormButton = ({ type, disabled, loadingLabel, label, loading }) => {
  return (
    <button type={type} disabled={disabled} className="form-btn">
      {loading ? loadingLabel : label}
    </button>
  );
};

export default FormButton;
