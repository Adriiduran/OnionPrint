//Dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../src/auth/AuthContext.jsx';
import { ToastContainer } from "react-toastify";
import { useAuth } from "../src/auth/AuthContext.jsx";
import { pdfjs } from "react-pdf";

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

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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