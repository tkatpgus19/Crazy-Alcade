import React from "react";
import PropTypes from "prop-types";

const BackgroundImage = ({ children }) => {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        backgroundImage: 'url("/images/background.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
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
