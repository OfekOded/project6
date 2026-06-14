/**
 * File: client/src/components/forms/FormField.jsx
 * Purpose: shared labelled input/textarea. For type="password" it also renders a
 *          Show/Hide toggle, and any field can show a small `hint` below it.
 * Owner: shared (forms)
 */
import { useState } from 'react';

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
  hint,
}) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';

  const commonProps = {
    id,
    className: 'input',
    value,
    onChange: (e) => onChange(e.target.value),
    autoComplete,
    placeholder,
    'aria-describedby': hint ? `${id}-hint` : undefined,
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      {multiline ? (
        <textarea {...commonProps} rows={rows} />
      ) : isPassword ? (
        <div className="input-wrap">
          {/* type flips between password/text so the eye toggle reveals the value */}
          <input {...commonProps} type={reveal ? 'text' : 'password'} />
          <button
            type="button"
            className="reveal-btn"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            aria-pressed={reveal}
          >
            {reveal ? 'Hide' : 'Show'}
          </button>
        </div>
      ) : (
        <input {...commonProps} type={type} />
      )}

      {hint && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}
