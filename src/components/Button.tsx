interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  fullWidth?: boolean;
}

export default function Button({ children, type = 'button', onClick, disabled = false, variant = 'primary', fullWidth = false }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    danger: 'bg-danger text-white hover:bg-danger-hover',
    secondary: 'bg-light-border dark:bg-dark-border text-light-text dark:text-dark-text hover:opacity-80',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {children}
    </button>
  );
}