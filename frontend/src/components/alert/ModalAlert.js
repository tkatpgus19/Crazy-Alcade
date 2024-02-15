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

  const cancelBtnStyle = {
    position: 'absolute', 
    width:'25px', 
    right:'10px',
    top:'5px', 
    fontFamily: "DNFBitBitv2", 
    background:'#0F679F',
    textAlign: 'center',
    borderRadius: '5px',
    color:'white'
  }

  return (
    <div>
      <div onClick={openModal} style={cancelBtnStyle}>X</div>
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
