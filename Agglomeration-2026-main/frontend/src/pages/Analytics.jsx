import { useState, useEffect } from "react";
import AnalyticsCards from "../components/AnalyticsCards";
import ChartsPanel from "../components/ChartsPanel";
import { getAnalytics } from "../services/api";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAnalytics();
      setData(response);
    } catch {
      // If backend analytics endpoint not available, use mock structure
      setError("Unable to fetch analytics data");
      setData({
        total_bottles: 0,
        total_weight: 0,
        pet_percentage: 0,
        quality_grade: 0,
        pet_count: 0,
        non_pet_count: 0,
        color_distribution: [],
        size_distribution: [],
        brand_distribution: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!data) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("PET Bottle Analysis Report", 14, 22);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

    // Summary
    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 45);

    const summaryData = [
      ["Total Bottles", data.total_bottles || 0],
      ["Total Weight", `${(data.total_weight || 0).toFixed(1)}g`],
      ["PET Bottles", `${(data.pet_percentage || 0).toFixed(1)}%`],
      ["Quality Grade", `${(data.quality_grade || 0).toFixed(1)}%`],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
    });

    // Color Distribution
    if (data.color_distribution && data.color_distribution.length > 0) {
      doc.text("Color Distribution", 14, doc.lastAutoTable.finalY + 15);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Color", "Count"]],
        body: data.color_distribution.map((item) => [item.name, item.value]),
      });
    }

    // Save
    doc.save(`pet-analysis-${Date.now()}.pdf`);
  };

  const handleExportExcel = () => {
    if (!data) return;

    // Create CSV content
    let csv = "PET Bottle Analysis Report\n\n";
    csv += "Summary Statistics\n";
    csv += `Total Bottles,${data.total_bottles || 0}\n`;
    csv += `Total Weight,${(data.total_weight || 0).toFixed(1)}g\n`;
    csv += `PET Percentage,${(data.pet_percentage || 0).toFixed(1)}%\n`;
    csv += `Quality Grade,${(data.quality_grade || 0).toFixed(1)}%\n\n`;

    if (data.color_distribution && data.color_distribution.length > 0) {
      csv += "Color Distribution\n";
      csv += "Color,Count\n";
      data.color_distribution.forEach((item) => {
        csv += `${item.name},${item.value}\n`;
      });
    }

    // Download
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pet-analysis-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-slate-600">
              Comprehensive analysis of detected PET bottles
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              disabled={!data || data.total_bottles === 0}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export PDF
            </button>

            <button
              onClick={handleExportExcel}
              disabled={!data || data.total_bottles === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Excel
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-amber-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-amber-700">
                {error} - Showing empty dashboard
              </span>
            </div>
          </div>
        )}

        {data && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <AnalyticsCards data={data} />

            {/* Charts */}
            {data.total_bottles > 0 ? (
              <ChartsPanel data={data} />
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
                <svg
                  className="w-16 h-16 text-slate-300 mx-auto mb-4"
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
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  No Data Available
                </h3>
                <p className="text-slate-500">
                  Upload and analyze images to see analytics here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
