// Third-party
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Routes
import router from "./routes";

const Loader = () => (
  <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: 16 }}>
    Loading...
  </div>
);

function App() {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;