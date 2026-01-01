import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminForm({
  fields,
  onSubmit,
  defaultValues = {},
  validationSchema = {},
  submitButtonText = 'Submit',
  showResetButton = false,
  resetButtonText = 'Reset',
  loading = false
}) {
  const [showPassword, setShowPassword] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    trigger
  } = useForm({
    defaultValues,
    mode: 'onBlur'
  });

  const onFormSubmit = (data) => {
    if (onSubmit && !loading) {
      onSubmit(data);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field) => {
    const {
      name,
      type = 'text',
      label,
      placeholder,
      required = false,
      options = [],
      validation = {},
      className = '',
      disabled = false,
      ...rest
    } = field;

    const error = errors[name];
    const fieldId = `field-${name}`;

    const fieldWrapperClass = `admin-form__field-wrapper ${className}`;
    const inputClass = `admin-form__input ${error ? 'admin-form__input--error' : ''}`;

    return (
      <div key={name} className={fieldWrapperClass}>
        {label && (
          <label htmlFor={fieldId} className="admin-form__label">
            {label}
            {required && <span className="admin-form__required">*</span>}
          </label>
        )}

        <div className="admin-form__input-wrapper">
          {type === 'select' ? (
            <select
              id={fieldId}
              className={inputClass}
              {...register(name, { required, ...validation })}
              disabled={disabled || loading}
              {...rest}
            >
              <option value="">{placeholder || 'Select an option'}</option>
              {options.map((option) => (
                <option key={option.value || option} value={option.value || option}>
                  {option.label || option}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={fieldId}
              className={inputClass}
              placeholder={placeholder}
              {...register(name, { required, ...validation })}
              disabled={disabled || loading}
              rows={rest.rows || 4}
              {...rest}
            />
          ) : type === 'password' ? (
            <div className="admin-form__password-wrapper">
              <input
                id={fieldId}
                type={showPassword[name] ? 'text' : 'password'}
                className={inputClass}
                placeholder={placeholder}
                {...register(name, { required, ...validation })}
                disabled={disabled || loading}
                {...rest}
              />
              <button
                type="button"
                className="admin-form__password-toggle"
                onClick={() => togglePasswordVisibility(name)}
                aria-label={showPassword[name] ? 'Hide password' : 'Show password'}
              >
                {showPassword[name] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          ) : type === 'checkbox' ? (
            <label className="admin-form__checkbox-label">
              <input
                id={fieldId}
                type="checkbox"
                className="admin-form__checkbox"
                {...register(name, { required, ...validation })}
                disabled={disabled || loading}
                {...rest}
              />
              <span className="admin-form__checkbox-custom"></span>
              {label}
            </label>
          ) : type === 'radio' ? (
            <div className="admin-form__radio-group">
              {options.map((option) => (
                <label key={option.value || option} className="admin-form__radio-label">
                  <input
                    type="radio"
                    value={option.value || option}
                    className="admin-form__radio"
                    {...register(name, { required, ...validation })}
                    disabled={disabled || loading}
                    {...rest}
                  />
                  <span className="admin-form__radio-custom"></span>
                  {option.label || option}
                </label>
              ))}
            </div>
          ) : (
            <input
              id={fieldId}
              type={type}
              className={inputClass}
              placeholder={placeholder}
              {...register(name, { required, ...validation })}
              disabled={disabled || loading}
              {...rest}
            />
          )}

          {error && (
            <div className="admin-form__error">
              <AlertCircle size={14} />
              <span>{error.message}</span>
            </div>
          )}
        </div>

        {field.hint && (
          <div className="admin-form__hint">
            {field.hint}
          </div>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="admin-form">
      <div className="admin-form__fields">
        {fields.map(renderField)}
      </div>

      <div className="admin-form__actions">
        {showResetButton && (
          <button
            type="button"
            className="admin-form__btn admin-form__btn--secondary"
            onClick={handleReset}
            disabled={loading || isSubmitting}
          >
            {resetButtonText}
          </button>
        )}
        <button
          type="submit"
          className="admin-form__btn admin-form__btn--primary"
          disabled={loading || isSubmitting}
        >
          {loading || isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}