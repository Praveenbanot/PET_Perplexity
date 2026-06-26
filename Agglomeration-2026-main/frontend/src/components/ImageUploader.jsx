import { useState, useRef } from "react";

const ImageUploader = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files) => {
    const validFiles = [];
    const validPreviews = [];

    Array.from(files).forEach((file) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert(
          `${file.name} is not a valid format. Only JPG, PNG, WEBP allowed.`,
        );
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        alert(`${file.name} exceeds 20MB limit.`);
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    return { validFiles, validPreviews };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const { validFiles, validPreviews } = validateFiles(files);
      setSelectedFiles(validFiles);
      setPreviews(validPreviews);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const { validFiles, validPreviews } = validateFiles(files);
      setSelectedFiles(validFiles);
      setPreviews(validPreviews);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
    }
  };

  const handleRemove = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    setPreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-50"
            : "border-slate-300 bg-white hover:border-slate-400"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="space-y-3">
          <svg
            className="mx-auto h-12 w-12 text-slate-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-slate-600">
            <span className="font-semibold text-emerald-600">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <p className="text-sm text-slate-500">JPG, PNG, WEBP up to 20MB</p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-slate-700">
              Selected Images ({selectedFiles.length})
            </h3>
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="text-sm text-slate-500 hover:text-slate-700 disabled:opacity-50"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-slate-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  disabled={isLoading}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="mt-1 text-xs text-slate-500 truncate">
                  {selectedFiles[index].name}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleUpload}
            disabled={isLoading || selectedFiles.length === 0}
            className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                Processing...
              </span>
            ) : (
              `Analyze ${selectedFiles.length} Image${selectedFiles.length > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
