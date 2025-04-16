import React, { useEffect, useState } from "react";

const EditItemModal = ({ isOpen, onClose, onSave, onDelete, item }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setName(item?.name || "");
    setPrice(item?.price || "");
  }, [item, name, price]);

  const handleSave = () => {
    if (!name || isNaN(price)) return;
    onSave({ name, price: parseFloat(price) });
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white w-[85%] rounded-xl p-6 shadow-xl flex flex-col gap-3">
          <h2 className="text-lg font-bold">{(name === "" || price === "") ? "Add Item" : "Edit Item"}</h2>

          <input
            className="p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Item name"
          />
          <input
            className="p-2 border rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
              className="btn-pressable bg-[var(--primary)] text-white px-4 py-2 rounded-full"
            >
              Save
            </button>
            <button
              onClick={onDelete}
              className="btn-pressable bg-red-500 border text-white px-4 py-2 rounded-full"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="btn-pressable bg-gray-300 px-4 py-2 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditItemModal;
