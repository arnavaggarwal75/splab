import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import axiosClient from "../api/axiosClient";
import { useUser } from "../contexts/UserContext";
import BillItem from "../components/BillItem";
import EditItemModal from "../components/EditItemModal";
import SummaryList from "../components/SummaryList";

function ConfirmUpload() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, setUser } = useUser();

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [items, setItems] = useState(null);
  const [subtotal, setSubtotal] = useState(null);
  const [fees, setFees] = useState(null);

  useEffect(() => {
    (async () => {
      const imageUrl = searchParams.get("image");
      if (!imageUrl) {
        navigate("/");
      }

      const formData = new FormData();
      try {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const file = new File([blob], "recipt.jpg", { type: blob.type });
        formData.append("file", file);
      } catch (error) {
        navigate("/upload");
        return;
      }

      const response = await axiosClient.post("/ocr/v2/extract", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setItems(response.data.items);
      setFees(response.data.fees);
      setSubtotal(() => {
        let sum = 0;
        response.data.items.forEach(item => {
          sum += item.price
        })
        return sum;
      })
    })();
  }, []);

  const createTab = () => {
    axiosClient
      .post("/tabs/create", {
        owner_name: user.name,
        owner_payment_id: user.paymentInfo,
        items,
        fees,
        subtotal: parseFloat(subtotal),
      })
      .then((response) => {
        navigate(`/get-link?code=${response.data.tab_id}`);
      });
  };

  const openEditModal = (item, index) => {
    setEditItem(item);
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleSaveItem = (updatedItem) => {
    const updated = [...items];
    updated[editIndex] = updatedItem;
    setItems(updated);
    if (items[editIndex]) {
      const diff = updatedItem.price - items[editIndex].price;
      setSubtotal((prev) => parseFloat(prev) + parseFloat(diff));
    } else {
      setSubtotal((prev) => parseFloat(prev) + parseFloat(updatedItem.price));
    }
  };

  const handleDeleteItem = () => {
    const updated = [...items];
    updated.splice(editIndex, 1);
    setItems(updated);
    setModalOpen(false);
    setSubtotal(
      (prev) => parseFloat(prev) - parseFloat(items[editIndex].price)
    );
  };

  const handleAddItem = () => {
    setEditItem(null);
    setEditIndex(items.length);
    setModalOpen(true);
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-between font-mono bg-white">
      <h1 className="m-5 text-lg font-bold">Does this look good?</h1>
      <div className="flex-1 overflow-y-auto w-[86%] scrollnone flex flex-col gap-2 pb-24">
        {items ? (
          items.map((item, index) => (
            <BillItem
              key={index}
              index={index + 1}
              name={item.name}
              price={item.price}
              checkboxDisabled
              onClick={() => openEditModal(item, index)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center min-h-full">
            <ClipLoader color="grey" size={30} />
          </div>
        )}
      </div>
      <button
        onClick={handleAddItem}
        className="btn-pressable mb-5 ml-auto mr-5 bg-[var(--primary)] text-white w-12 h-12 rounded-full text-2xl shadow-md z-50"
      >
        +
      </button>
      <div className="flex flex-col justify-evenly shadow-xl items-center bg-white/70 backdrop-blur-md w-full">
        {items && (
          <SummaryList
            borderTop
            total
            summary={[...fees, { "name": "Subtotal", "amount": subtotal }]}
          />
        )}
        <div className="px-6 py-4 flex justify-evenly items-center w-full">
          <button
            onClick={() => navigate("/upload")}
            className="px-[10%] py-3 bg-[var(--primary)] text-white rounded-full shadow transition btn-pressable"
          >
            Back
          </button>
          <button
            onClick={createTab}
            className="px-[10%] py-3 bg-[var(--primary)] text-white rounded-full shadow transition btn-pressable"
          >
            Proceed
          </button>
        </div>
      </div>
      <EditItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        item={editItem}
      />
    </div>
  );
}

export default ConfirmUpload;
