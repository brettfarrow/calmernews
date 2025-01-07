import React from 'react';
import { useRouter } from 'next/router';

const TimeoutError: React.FC = () => {
  const router = useRouter();

  const handleRefresh = () => {
    router.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <p className="text-red-600 font-medium mb-4">
        error: request timed out, please refresh to try again
      </p>
      <button
        className="rounded text-center bg-purple-700 w-28 h-12 text-white font-bold transition duration-500 ease-in-out hover:bg-purple-800"
        onClick={handleRefresh}
      >
        refresh
      </button>
    </div>
  );
};

export default TimeoutError;