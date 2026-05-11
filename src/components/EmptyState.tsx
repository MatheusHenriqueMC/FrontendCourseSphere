interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="text-center py-10">
      <p className="text-light-text-secondary dark:text-dark-text-secondary">{message}</p>
    </div>
  );
}