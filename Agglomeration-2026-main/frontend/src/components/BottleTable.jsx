const BottleTable = ({ bottles }) => {
  if (!bottles || bottles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-slate-500">
        No bottles detected
      </div>
    );
  }

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

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Color
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                PET
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Length (cm)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Weight (g)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Bounding Box
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bottles.map((bottle, index) => {
              const colorStyle = getColorStyle(bottle.color);
              return (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bottle.class_name?.includes("transp")
                          ? "bg-blue-100 text-blue-700"
                          : bottle.class_name?.includes("dark")
                            ? "bg-slate-600 text-white"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {bottle.class_name || "Unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${colorStyle.dot}`}
                      />
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${colorStyle.bg} ${colorStyle.text}`}
                      >
                        {bottle.color || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bottle.is_pet
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {bottle.is_pet ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {bottle.estimated_length_cm != null ? (
                      <span className="font-medium">
                        {bottle.estimated_length_cm.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {bottle.estimated_weight_g != null ? (
                      <span className="font-medium">
                        {bottle.estimated_weight_g.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{
                            width: `${(bottle.confidence * 100).toFixed(0)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {(bottle.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 font-mono">
                    {bottle.bbox_xyxy
                      ? `[${bottle.bbox_xyxy.map((v) => Math.round(v)).join(", ")}]`
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BottleTable;
