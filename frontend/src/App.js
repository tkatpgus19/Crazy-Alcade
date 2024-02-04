import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Room from "./pages/Room/Room";
import Game from "./pages/Game/Game";
import Redirection from "./pages/Login/Redirection";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            exact
            path="http://192.168.123.109:3000/login/oauth2/code/kakao"
            element={<Redirection />}
          />
          <Route path="/main" element={<Main />} />
          <Route path="/room" element={<Room />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
