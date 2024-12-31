import "./App.css";
import {Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <main className="App">
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          duration: 2000,
        }}
      />
      <Outlet />
    </main>
  );
}

export default App;
