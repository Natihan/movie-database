// src/components/SkeletonDetail.jsx

function SkeletonDetail() {
  return (
    <div className="max-w-3xl mx-auto p-4 animate-pulse">
      <div className="h-6 bg-gray-300 w-1/4 mb-4 rounded"></div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 h-96 bg-gray-300 rounded"></div>
        <div className="flex-1 space-y-4">
          <div className="h-6 bg-gray-300 w-3/4 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-full rounded"></div>
          <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonDetail;
