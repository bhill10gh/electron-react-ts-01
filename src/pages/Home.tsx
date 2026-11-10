import { useState } from "react";
import Modal from "../components/Modal";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<"user" | "product">("user");

  const openModal = (type: "user" | "product") => {
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <>
      <h1>I hope you have lots of fun with this project! 😻</h1>

      <p>Piko</p>
      <div className="p-8 space-x-3">
        <button
          onClick={() => openModal("user")}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add User
        </button>

        <button
          onClick={() => openModal("product")}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Add Product
        </button>

        <Modal
          isOpen={isOpen}
          title={modalType === "user" ? "Add User" : "Add Product"}
          onClose={closeModal}
          width="max-w-lg"
          footer={
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  console.log("Save", modalType);
                  closeModal();
                }}
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          }
        >
          {modalType === "user" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          )}

          {modalType === "product" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="w-full rounded border border-gray-300 px-3 py-2"
                />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
