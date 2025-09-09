import React from 'react';

export const DebugToggle = () => {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg shadow-lg p-2 text-xs text-yellow-800">
        🐛 Dev Mode
      </div>
    </div>
  );
};
