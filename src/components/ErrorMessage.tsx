interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900/30 text-danger p-3 rounded-lg mb-4 text-sm">
      {message}
    </div>
  );
}