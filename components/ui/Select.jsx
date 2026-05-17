"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reusable Select component with custom dropdown
 */
export default function Select({
  label,
  required = false,
  options = [],
  className = "",
  value,
  onChange,
  name,
  ...props
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (option) => {
    onChange?.({ target: { name, value: option.value } });
    setOpen(false);
  };

  return (
    <div className={className} ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`w-full border rounded-lg px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-white transition ${
            open ? "border-secondary ring-2 ring-secondary" : "border-gray-300"
          } ${selected?.value === "" ? "text-gray-400" : "text-gray-800"}`}
        >
          <span>{selected?.label}</span>
          <i className={`fa-solid fa-chevron-down text-gray-400 text-xs transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                className={`px-4 py-3 text-sm cursor-pointer flex items-center gap-2 hover:bg-background transition ${
                  option.value === value ? "text-secondary font-medium bg-surface" : "text-gray-700"
                }`}
              >
                {option.value === value && <i className="fa-solid fa-check text-xs text-secondary" />}
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
