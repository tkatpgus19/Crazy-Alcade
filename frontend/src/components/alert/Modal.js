import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";

const Modal = ({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  message,
  showCancelButton,
  showConfirmButton,
}) => {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    console.log("확인 버튼이 클릭되었습니다.");
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    console.log("취소 버튼이 클릭되었습니다.");
    onCancel();
    onClose();
  };

  return (
    <div
      className={`${styles.modalContainer} ${
        showConfirmButton ? styles.showConfirmButton : ""
      }`}
    >
      <div className={styles.modalStyle}>
        <div className={styles.modalTitle}>알림창</div>
        <div className={styles.message}>{message}</div>
        <div className={styles.modalContentStyle}>
          <div>
            {showCancelButton && (
              <button
                className={styles.closeButtonStyle}
                onClick={handleCancel}
              >
                취소
              </button>
            )}
            <button className={styles.checkButtonStyle} onClick={handleConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
};

const ModalAlert = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleConfirm = () => {
    console.log("확인 버튼 클릭");
  };

  return (
    <div>
      <button onClick={openModal}>클릭하세요</button>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        onCancel={() => {}}
        message="'림수빈' 님을 강퇴 시키시겠습니까?"
        showCancelButton={false}
        showConfirmButton={false} // 확인창일 때 확인 버튼 중앙 정렬
      />
    </div>
  );
};

export default ModalAlert;
