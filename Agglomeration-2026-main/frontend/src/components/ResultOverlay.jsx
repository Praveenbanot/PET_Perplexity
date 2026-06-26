import { useState } from "react";

const ResultOverlay = ({ bottles }) => {
  const [hoveredBottle, setHoveredBottle] = useState(null);

  const getColorStyle = (color) => {
    const colorMap = {
      transparent: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        dot: "bg-blue-400",
      },
      black: { bg: "bg-slate-700", text: "text-white", dot: "bg-slate-900" },
      dark: { bg: "bg-slate-600", text: "text-white", dot: "bg-slate-800" },
      green: {
        bg: "bg-green-100",
        text: "text-green-700",
        dot: "bg-green-500",
      },
      blue: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500" },
      brown: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        dot: "bg-amber-600",
      },
      unknown: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        dot: "bg-purple-400",
      },
    };
    return colorMap[color?.toLowerCase()] || colorMap.unknown;
  };

  // Calculate total weight
  const totalWeight =
    bottles?.reduce((acc, b) => acc + (b.estimated_weight_g || 0), 0) || 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {bottles && bottles.length > 0 && (
        <div className="p-4 bg-slate-50">
          <div className="text-sm text-slate-600 mb-4 flex flex-wrap gap-3">
            <span>
              Detected{" "}
              <span className="font-semibold text-emerald-600">
                {bottles.length}
              </span>{" "}
              bottle{bottles.length > 1 ? "s" : ""}
            </span>
            <span>•</span>
            <span>
              <span className="font-semibold text-blue-600">
                {bottles.filter((b) => b.is_pet).length}
              </span>{" "}
              PET
            </span>
            <span>•</span>
            <span>
              Total Weight:{" "}
              <span className="font-semibold text-amber-600">
                {totalWeight.toFixed(1)}g
              </span>
            </span>
          </div>

          <div className="space-y-2">
            {bottles.map((bottle, index) => {
              const colorStyle = getColorStyle(bottle.color);
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    hoveredBottle === index
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  onMouseEnter={() => setHoveredBottle(index)}
                  onMouseLeave={() => setHoveredBottle(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-slate-500">
                          #{index + 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            bottle.class_name?.includes("transp")
                              ? "bg-blue-100 text-blue-700"
                              : bottle.class_name?.includes("dark")
                                ? "bg-slate-600 text-white"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {bottle.class_name || "Unknown"}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            bottle.is_pet
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {bottle.is_pet ? "PET" : "Non-PET"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${colorStyle.dot}`}
                          />
                          <span className="capitalize">
                            {bottle.color || "Unknown"}
                          </span>
                        </div>
                        {bottle.estimated_length_cm != null && (
                          <div>
                            <strong>Length:</strong>{" "}
                            {bottle.estimated_length_cm.toFixed(1)} cm
                          </div>
                        )}
                        {bottle.estimated_weight_g != null && (
                          <div>
                            <strong>Weight:</strong>{" "}
                            {bottle.estimated_weight_g.toFixed(1)} g
                          </div>
                        )}
                        <div>
                          <strong>Confidence:</strong>{" "}
                          {((bottle.confidence || 0) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="ml-3">
                      {bottle.is_pet ? (
                        <svg
                          className={`w-6 h-6 transition-colors ${
                            hoveredBottle === index
                              ? "text-emerald-600"
                              : "text-emerald-400"
                          }`}
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
                      ) : (
                        <svg
                          className={`w-6 h-6 transition-colors ${
                            hoveredBottle === index
                              ? "text-red-600"
                              : "text-red-400"
                          }`}
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
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(!bottles || bottles.length === 0) && (
        <div className="p-8 text-center text-slate-500">
          No bottles detected in this image
        </div>
      )}
    </div>
  );
};

export default ResultOverlay;
