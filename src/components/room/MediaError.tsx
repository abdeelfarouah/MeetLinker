import { AlertCircle } from 'lucide-react';

interface MediaErrorProps {
  error: string | null;
}

const MediaError = ({ error }: MediaErrorProps) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
    </div>
  );
};

export default MediaError;