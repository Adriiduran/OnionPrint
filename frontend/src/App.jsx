//Dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './auth/AuthContext.jsx';
import { ToastContainer } from "react-toastify";
import { pdfjs } from "react-pdf";
import { HelmetProvider } from 'react-helmet-async';

//Contexts
import { FilePreferencesProvider } from "./context/FilePreferencesContext.jsx";
import { ShoppingCartProvider } from "./context/ShoppingCartContext.jsx";

//Pages
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Auth/Register.jsx";
import Login from "./pages/Auth/Login.jsx";
import LoginAdmin from "./pages/Auth/LoginAdmin.jsx";
import ShoppingCart from "./pages/Cart/ShoppingCart.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import PaymentMethods from "./pages/Info/PaymentMethods.jsx";
import Cookies from "./pages/Info/Cookies.jsx";
import ProductionShipment from "./pages/Info/ProductionShipment.jsx";
import WarrantyReturns from "./pages/Info/WarrantyReturns.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import Landing from "./pages/Landing/Landing.jsx";

//Components
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"

//Styles
import "./App.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function App() {
    return (
        <div className="App">
            <HelmetProvider>
                <AuthProvider>
                    <FilePreferencesProvider>
                        <ShoppingCartProvider>
                            <BrowserRouter>
                                <Header />
                                <Routes>
                                    <Route path="/" element={<Landing />} />
                                    <Route path="/imprimir-apuntes-online" element={<Landing />} />
                                    <Route path="/copisteria-online" element={<Landing />} />
                                    <Route path="/fotocopias-online" element={<Landing />} />
                                    <Route path="/universitarios" element={<Landing />} />
                                    <Route path="/app" element={<Home />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/forgotpassword" element={<ForgotPassword />} />
                                    <Route path="/cart" element={<ShoppingCart />} />
                                    <Route path="/admin" element={<LoginAdmin />} />
                                    <Route path="/admin/*" element={<AdminDashboard />} />
                                    <Route path="/payment-methods" element={<PaymentMethods />} />
                                    <Route path="/cookies" element={<Cookies />} />
                                    <Route path="/warranty-returns" element={<WarrantyReturns />} />
                                    <Route path="/production-shipment" element={<ProductionShipment />} />
                                    <Route path="*" element={<PageNotFound />} />
                                </Routes>
                                <Footer />
                            </BrowserRouter>
                        </ShoppingCartProvider>
                    </FilePreferencesProvider>
                </AuthProvider>
            </HelmetProvider>
            <ToastContainer />
        </div>
    )
}
