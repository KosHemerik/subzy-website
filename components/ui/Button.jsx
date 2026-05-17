/**
 * Reusable Button component with multiple variants
 */
export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  className = "",
  type = "button",
  ...props 
}) {
  const baseStyles = "font-bold transition duration-300 rounded-lg inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-primary shadow-lg",
    secondary: "bg-secondary hover:bg-accent text-white shadow-md shadow-secondary/30",
    outline: "bg-white border-2 border-primary text-primary hover:bg-gray-50",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-3.5 text-lg",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
