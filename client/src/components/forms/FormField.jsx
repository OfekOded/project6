export default function FormField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
  rows,
  multiline = false,
}) {
  const commonProps = {
    id,
    className: 'input',
    value,
    onChange: (e) => onChange(e.target.value),
    autoComplete,
    placeholder,
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : (
        <input {...commonProps} type={type} />
      )}
    </div>
  );
}
