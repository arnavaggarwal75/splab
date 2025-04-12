import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";

const Bill = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
  };

  const handleProceed = () => {
    navigate("/confirm-upload"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-6 font-mono">
      <h2 className="text-2xl font-semibold mb-6">Upload your bill</h2>

      {!selectedImage ? (
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed bg-white p-6 rounded-xl shadow-md cursor-pointer">
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500 mb-2">
            <FaCamera className="w-20 h-20"/>
            Tap to take a picture or upload
          </div>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <img
            src={selectedImage}
            alt="Uploaded bill"
            className="w-full max-w-xs rounded-xl shadow-md border-4 bg-white"
          />
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-full shadow transition"
            >
              Cancel
            </button>
            <button
              onClick={handleProceed}
              className="px-4 py-2 bg-[var(--primary)] text-white rounded-full shadow transition"
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bill;
