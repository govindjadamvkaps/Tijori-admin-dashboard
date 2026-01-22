// components/ui/Loader.tsx
export const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-blue-500 animate-spin dark:border-gray-700"></div>
    </div>
  );
};