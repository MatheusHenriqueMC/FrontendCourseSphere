interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="text-center py-10">
      <p className="text-light-text-secondary dark:text-dark-text-secondary">{message}</p>
    </div>
  );
}