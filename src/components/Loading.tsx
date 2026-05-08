interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}