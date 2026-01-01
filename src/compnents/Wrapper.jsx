import React from "react";

const Wrapper = ({ children }) => {
  return (
    <div className="main-wrapper">
      <div className="navbar">
        <div className="logidiv">
          <h2>GoMenu</h2>
        </div>
        <div className="rightnavdiv">
          <div className="audionDIv">
            {" "}
            <audio controls>
              <source src="/sound.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="languageDiv"></div>
        </div>
      </div>
      <div className="gobackdiv">
        <button className="gobackbtn">Go Back</button>
      </div>

      {children}
    </div>
  );
};

export default Wrapper;
