import React from "react";
import Background from "../../components/Background";
import RoomHeader from "./RoomHeader";
import RoomHeader2 from "./RoomHeader2";
import GrayBox from "../../components/graybox/GrayBox";
import styles from "./WaitingRoom.module.css";
import MiniBox from "./MiniBox";
import Status from "./Status";

const Room = () => {
  return (
    <Background>
      <RoomHeader roomTitle="1. 너만 오면 고" />
      <RoomHeader2 onExitClick={() => alert("Exit clicked")} />
      <GrayBox>
        <div className={styles.blue}>
          <div className={styles.miniBoxup}>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
          </div>
          <div className={styles.miniBoxdown}>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
            <div>
              <MiniBox image="/images/user.png" />
              <Status />
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.chat}></div>
          <div className={styles.button4}>
            <div className={styles.start}>START</div>
            <div className={styles.button3}>
              <div className={styles.rightbutton}>
                <p>버튼1</p>
              </div>
              <div className={styles.rightbutton}>
                <p>버튼2</p>
              </div>
              <div className={styles.rightbutton}>
                <p>버튼3</p>
              </div>
            </div>
          </div>
        </div>
      </GrayBox>
    </Background>
  );
};

export default Room;
