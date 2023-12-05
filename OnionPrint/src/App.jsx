//Dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../src/auth/AuthContext.jsx';
import { ToastContainer } from "react-toastify";
import { useAuth } from "../src/auth/AuthContext.jsx";

//Pages
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx"

//Components
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
import Loader from './components/Loader/Loader.jsx'

//Styles
import "./App.css"
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";

export default function App() {
    return (
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgotpassword" element={<ForgotPassword />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </AuthProvider>
            {/* {loading && <Loader />} */}
            <ToastContainer />
        </div>
    )
}