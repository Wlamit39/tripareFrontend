import React from 'react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center mt-4">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}