// app/(same-route)/loading.tsx
export default function loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-white font-medium">Loading...</p>
      </div>
    </div>
  );
}