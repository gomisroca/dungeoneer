import React from 'react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-8 border-zinc-200 dark:border-zinc-800 border-t-blue-500 rounded-full animate-spin mt-10">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner