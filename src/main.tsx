import ReactDOM from "react-dom/client";
import RouterApp from "./router";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <RouterApp />
  </HashRouter>
);
