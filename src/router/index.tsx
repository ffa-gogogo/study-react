import { Routes, Route } from "react-router-dom";
import Home from "../containers/index/index.tsx";
import Map from "../containers/map/index.tsx";
import HomePage from "../containers/index-page/index.tsx";

function App() {
  return (
    <div>
      {/* 路由匹配 */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/luckly" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
