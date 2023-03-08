import React from 'react';

export default function FormInput({
  className,
  label: {text: textLabel, className: classNameLabel} = {},
  input: {placeholder, className: classNameInput , ...input},
  ...props
}) {
  return (
    <div className={className} {...props}>
      {textLabel && <label className={`mb-2 ${classNameLabel}`}>{textLabel}</label>}
      <input placeholder={placeholder} className={`focus:shadow-md ${classNameInput}`} {...input}/>
    </div>
  );
}
