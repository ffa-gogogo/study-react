import { Routes, Route } from "react-router-dom";
import Home from "../containers/index/index.tsx";

function App() {
  return (
    <div>
      {/* 路由匹配 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
