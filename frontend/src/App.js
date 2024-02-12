import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Room from "./pages/Room/Room";
import Game from "./pages/Game/Game";
import KakaoRedirection from "./pages/Login/KakaoRedirection";
import GoogleRedirection from "./pages/Login/GoogleRedirection";
import GameIntroduction from "./pages/Main/GameIntroduction";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            exact
            path="/login/oauth2/code/kakao"
            // path="/oauth2/kakao"
            element={<KakaoRedirection />}
          />
          <Route
            exact
            path="/login/oauth2/code/google"
            // path="/oauth2/kakao"
            element={<GoogleRedirection />}
          />
          <Route path="/game-introduction" element={<GameIntroduction />} />
          <Route path="/main" element={<Main />} />
          <Route path="/room" element={<Room />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
