import React from 'react';
import Modal from 'react-modal';
import { useModal } from '../../context/ModalProvider';

const BaseModal = () => {

const { isModalOpen, closeModal, modalContent } = useModal();

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      className="relative p-6 w-full max-w-md mx-auto bg-white rounded-lg shadow-lg base-modal"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="relative">
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {modalContent}
      </div>
    </Modal>
  );
};

export default BaseModal;