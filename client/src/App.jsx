//Dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../src/auth/AuthContext.jsx';
import { ToastContainer } from "react-toastify";
import { pdfjs } from "react-pdf";

//Contexts
import { useAuth } from "../src/auth/AuthContext.jsx";
import { FilePreferencesProvider } from "./context/FilePreferencesContext.jsx";
import { ShoppingCartProvider } from "./context/ShoppingCartContext.jsx";

//Pages
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import ShoppingCart from "./pages/Cart/ShoppingCart.jsx";
import Completion from './pages/Completion/Completion.jsx';

//Components
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"

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
                <FilePreferencesProvider>
                    <ShoppingCartProvider>
                        <BrowserRouter>
                            <Header />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/forgotpassword" element={<ForgotPassword />} />
                                <Route path="/cart" element={<ShoppingCart />} />
                                <Route path="/completion" element={<Completion />} />
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </ShoppingCartProvider>
                </FilePreferencesProvider>
            </AuthProvider>
            <ToastContainer />
        </div>
    )
}