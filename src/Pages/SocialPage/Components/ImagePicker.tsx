import React, { useRef, useState, useEffect } from "react";

interface ImagePickerProps {
  onImageSelect: (imageDataUrl: string) => void;
}



const ImagePicker: React.FC<ImagePickerProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showRetry, setShowRetry] = useState(false);
  const hasOpenedOnce = useRef(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
  const dataUrl = reader.result as string;
  setPreview(dataUrl);
  onImageSelect(dataUrl); // ← pass it to the parent
};
      reader.readAsDataURL(file);
    }
  };

  // Open the picker automatically on first mount only
  useEffect(() => {
    if (!hasOpenedOnce.current) {
      hasOpenedOnce.current = true;
      fileInputRef.current?.click();
    }
  }, []);

  // Detect when the dialog closes without a file (user cancelled)
  useEffect(() => {
    const handleFocus = () => {
      // If no preview and the picker was already opened, show retry
      if (!preview && hasOpenedOnce.current && fileInputRef.current?.files?.length === 0) {
        setShowRetry(true);
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [preview]);

  const handleRetry = () => {
    setShowRetry(false);
    fileInputRef.current?.click();
  };

  return (
    <div >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="w-full flex justify-center ">
          <img
            src={preview}
            alt="Selected"
            className="max-w-sm  max-h-96 rounded-xl "
          />
         
        </div>
      ) : showRetry ? (
        <div  className="text-center space-y-4">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            جرب إضافة صور
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            تحميل صورة
          </button>
        </div>
      ) : (
        <p className="text-gray-400 dark:text-gray-500 animate-pulse">
          Opening image picker...
        </p>
      )}
    </div>
  );
};

export default ImagePicker;