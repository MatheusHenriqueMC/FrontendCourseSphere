interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function FormInput({ label, type = 'text', value, onChange, placeholder }: FormInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-light-text dark:text-dark-text mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-bg text-light-text dark:text-dark-text rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
      />
    </div>
  );
}