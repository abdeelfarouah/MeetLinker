import React from 'react';

interface MediaErrorProps {
  error: string | null;
}

const MediaError: React.FC<MediaErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-4 bg-red-100 text-red-800 border border-red-300 rounded">
      <p>{error}</p>
    </div>
  );
};

export default MediaError;
