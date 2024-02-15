// ModalAlert.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal"; // Modal 컴포넌트의 경로에 맞게 조정
import axios from "axios";

const ModalAlert = ({
  message,
  showCancelButton = true,
  showConfirmButton = true,
  userUUID,
  roomId,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleConfirm = () => {
    console.log("확인 버튼 클릭\n\n\n" + roomId + "\n" + userUUID);
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/rooms/exit?roomId=${roomId}&member-id=${userUUID}&isExpelled=true`
      )
      .then((res) => {
        console.log(res);
        closeModal();
      });
    // closeModal(); // 모달 닫기
  };

  const cancelBtnStyle = {
    position: "absolute",
    width: "25px",
    right: "10px",
    top: "5px",
    fontFamily: "DNFBitBitv2",
    background: "#0F679F",
    textAlign: "center",
    borderRadius: "5px",
    color: "white",
  };

  return (
    <div>
      <div onClick={openModal} style={cancelBtnStyle}>
        X
      </div>
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
  userUUID: PropTypes.string,
  roomId: PropTypes.string.isRequired,
};

export default ModalAlert;
