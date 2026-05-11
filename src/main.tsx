import ReactDOM from "react-dom/client";
import RouterApp from "./router";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <RouterApp />
  </BrowserRouter>
);
