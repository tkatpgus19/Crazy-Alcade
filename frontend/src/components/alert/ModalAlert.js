// ModalAlert.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal"; // Modal 컴포넌트의 경로에 맞게 조정

const ModalAlert = ({
  message,
  showCancelButton = true,
  showConfirmButton = true,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleConfirm = () => {
    console.log("확인 버튼 클릭");
    closeModal(); // 모달 닫기
  };

  return (
    <div>
      <button onClick={openModal}>클릭하세요</button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        message={message}
        showCancelButton={showCancelButton}
        showConfirmButton={showConfirmButton}
      />
    </div>
  );
};

ModalAlert.propTypes = {
  message: PropTypes.string.isRequired,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
};

export default ModalAlert;
