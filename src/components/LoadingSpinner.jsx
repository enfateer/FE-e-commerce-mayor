import { Spinner } from "flowbite-react";

const LoadingSpinner = ({ fullPage = false, size = "xl" }) => {
  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950">
        <div className="text-center">
          <Spinner aria-label="Loading..." size={size} color="purple" />
          <p className="mt-4 text-surface-500 dark:text-surface-400 font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Spinner aria-label="Loading..." size={size} color="purple" />
    </div>
  );
};

export default LoadingSpinner;
