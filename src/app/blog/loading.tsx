export default function BlogLoading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-9 w-40 bg-gray-800 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-64 bg-gray-800/60 rounded-lg animate-pulse" />
          <div className="mt-6 h-10 w-64 bg-gray-800/40 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category tabs skeleton */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 bg-gray-800/60 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Post cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800 bg-gray-900/50 p-5 animate-pulse"
            >
              <div className="h-5 w-16 bg-gray-800 rounded-full mb-4" />
              <div className="h-6 w-full bg-gray-800 rounded mb-2" />
              <div className="h-4 w-4/5 bg-gray-800/70 rounded mb-1" />
              <div className="h-4 w-3/5 bg-gray-800/70 rounded mb-4" />
              <div className="flex gap-3 pt-4 border-t border-gray-800/60">
                <div className="h-4 w-24 bg-gray-800/60 rounded" />
                <div className="h-4 w-20 bg-gray-800/60 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
