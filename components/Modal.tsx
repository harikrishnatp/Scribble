import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg shadow-lg w-full max-w-3xl p-4 relative border border-zinc-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2  right-2 bg-zinc-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-zinc-700 border border-zinc-600 z-50"
        >
          ✕
        </button>
        {/* Modal Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};