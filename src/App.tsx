import Login from "./Components/Login/Login";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Register } from "./Components/Register/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Profile } from "./Pages/Profile";

import NavBar from "./Components/Navbar/NavBar";
import Home from "./Pages/Home";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import CreatePage from "./Pages/CreatePage";
import ShowPage from "./Pages/ShowPage";
import EditPage from "./Pages/EditPage";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <ToastContainer position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/book/:id" element={<ShowPage />} />
          <Route path="/book/:id/edit" element={<EditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
