import React from "react";
import PropTypes from "prop-types";

const BackgroundImage = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        backgroundImage: 'url("/images/background.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

BackgroundImage.propTypes = {
  children: PropTypes.node,
};

export default BackgroundImage;
