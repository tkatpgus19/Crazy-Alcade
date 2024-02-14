import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Room from "./pages/Room/Room";
import Game from "./pages/Game/Game";
import GameIntroduction from "./pages/Main/GameIntroduction";
import LoginRedirection from "./pages/Login/LoginRedirection";
import MyPage from "./pages/Main/MyPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/game-introduction" element={<GameIntroduction />} />
          <Route path="/login-redirection" element={<LoginRedirection />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/room" element={<Room />} />
          <Route path="/game" element={<Game />} />
          {/* <Route path="/*" element={<h1>비정상적인 접근입니다.</h1>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
