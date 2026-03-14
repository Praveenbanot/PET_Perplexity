import { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ResultOverlay from "../components/ResultOverlay";
import BottleTable from "../components/BottleTable";
import { uploadSingleImage, uploadBatchImages } from "../services/api";

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (files) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      let response;

      if (files.length === 1) {
        response = await uploadSingleImage(files[0]);
      } else {
        response = await uploadBatchImages(files);
      }

      setResults(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Upload failed. Please try again.",
      );
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-700 mb-3">
            PET Bottle Analysis
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload images to detect and analyze PET bottles using advanced AI
            technology
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-10">
          <ImageUploader onUpload={handleUpload} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-10 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl p-6 shadow-lg animate-shake">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-bold text-red-800 mb-1">
                  Upload Error
                </h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-10">
            {/* Handle single image result */}
            {results.result && !results.results && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 4 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Analysis Results
                    </h2>
                  </div>
                  <div className="p-6">
                    <ResultOverlay bottles={results.result || []} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Detected Bottles
                    </h3>
                  </div>
                  <div className="p-6">
                    <BottleTable bottles={results.result || []} />
                  </div>
                </div>
              </div>
            )}

            {/* Handle batch results */}
            {results.results && Array.isArray(results.results) && (
              <div className="space-y-10">
                {results.results.map((result, index) => (
                  <div key={index} className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-4">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg mr-3 text-sm">
                            {index + 1}
                          </span>
                          Image {index + 1} - Analysis Results
                        </h2>
                      </div>
                      <div className="p-6">
                        <ResultOverlay bottles={result || []} />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-gradient-to-r from-slate-700 to-slate-900 px-6 py-4">
                        <h3 className="text-xl font-bold text-white flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                          </svg>
                          Detected Bottles
                        </h3>
                      </div>
                      <div className="p-6">
                        <BottleTable bottles={result || []} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Stats */}
            {results.analytics && (
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Summary Statistics
                  </h3>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                          Total Bottles
                        </p>
                        <svg
                          className="w-8 h-8 text-blue-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-blue-900">
                        {results.analytics.total_bottles || 0}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                          PET Bottles
                        </p>
                        <svg
                          className="w-8 h-8 text-emerald-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-emerald-900">
                        {results.analytics.pet_count || 0}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                          Non-PET
                        </p>
                        <svg
                          className="w-8 h-8 text-amber-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-amber-900">
                        {results.analytics.non_pet_count || 0}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">
                          Avg Confidence
                        </p>
                        <svg
                          className="w-8 h-8 text-purple-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-purple-900">
                        {(
                          (results.analytics.avg_confidence || 0) * 100
                        ).toFixed(1)}
                        <span className="text-xl text-purple-700 ml-1">%</span>
                      </p>
                    </div>
                  </div>

                  {/* Weight & Size Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">
                          Total Weight
                        </p>
                        <svg
                          className="w-8 h-8 text-orange-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-orange-900">
                        {(results.analytics.total_weight_g || 0).toFixed(1)}
                        <span className="text-xl text-orange-700 ml-1">g</span>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">
                          Avg Weight
                        </p>
                        <svg
                          className="w-8 h-8 text-teal-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-teal-900">
                        {(results.analytics.avg_weight_g || 0).toFixed(1)}
                        <span className="text-xl text-teal-700 ml-1">g</span>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">
                          Avg Length
                        </p>
                        <svg
                          className="w-8 h-8 text-indigo-500 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                      </div>
                      <p className="text-4xl font-extrabold text-indigo-900">
                        {(results.analytics.avg_length_cm || 0).toFixed(1)}
                        <span className="text-xl text-indigo-700 ml-1">cm</span>
                      </p>
                    </div>
                  </div>

                  {/* Color Distribution */}
                  {results.analytics.color_distribution &&
                    Object.keys(results.analytics.color_distribution).length >
                      0 && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                          Color Distribution
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {Object.entries(
                            results.analytics.color_distribution,
                          ).map(([color, count]) => (
                            <div
                              key={color}
                              className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2"
                            >
                              <span
                                className={`w-3 h-3 rounded-full ${
                                  color === "transparent"
                                    ? "bg-blue-400"
                                    : color === "black"
                                      ? "bg-slate-900"
                                      : color === "green"
                                        ? "bg-green-500"
                                        : color === "blue"
                                          ? "bg-sky-500"
                                          : color === "brown"
                                            ? "bg-amber-600"
                                            : "bg-purple-400"
                                }`}
                              />
                              <span className="text-sm font-medium text-slate-700 capitalize">
                                {color}
                              </span>
                              <span className="text-sm font-bold text-slate-900">
                                {count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
