// Modal.js
import React from "react";
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
    onConfirm && onConfirm();
    onClose();
  };

  const handleCancel = () => {
    console.log("취소 버튼이 클릭되었습니다.");
    onCancel && onCancel();
    onClose();
  };

  return (
    <div className={styles.modalContainer}>
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
            {showConfirmButton && (
              <button
                className={styles.checkButtonStyle}
                onClick={handleConfirm}
              >
                확인
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  message: PropTypes.string.isRequired,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
};

export default Modal;
