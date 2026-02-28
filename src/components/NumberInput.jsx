export default function NumberInput({
  value,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled,
  placeholder,
  ariaLabel,
  ...rest
}) {
  return (
    <input
      {...rest}
      className={className}
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onFocus={(e) => e.target.select()}
      onWheel={(e) => {
        e.preventDefault();
        e.currentTarget.blur();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      inputMode="numeric"
    />
  );
}
