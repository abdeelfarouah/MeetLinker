import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MediaErrorProps {
  error: string | null;
}

const MediaError: React.FC<MediaErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default MediaError;