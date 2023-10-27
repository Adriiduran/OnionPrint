//Dependencies
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../src/auth/AuthContext.jsx';
//Pages
import Home from "./pages/Home/Home.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx"
//Components
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
//Styles
import "./App.css"

export default function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                    <Footer />
                </AuthProvider>
            </BrowserRouter>
        </div>
    )
}