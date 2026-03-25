const FormButton = ({ type, disabled, loadingLabel, label, loading }) => {
  return (
    <button type={type} disabled={disabled}>
      {loading ? loadingLabel : label}
    </button>
  );
};

export default FormButton;
