/**
 * Reusable Textarea component
 */
export default function Textarea({ 
  label, 
  required = false, 
  className = "",
  rows = 5,
  ...props 
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent bg-gray-50 resize-none"
        {...props}
      />
    </div>
  );
}
