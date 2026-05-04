/**
 * Reusable Select component
 */
export default function Select({ 
  label, 
  required = false, 
  options = [], 
  className = "",
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <i className="fa-solid fa-chevron-down absolute right-4 top-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
