//Dependencies
 import { BrowserRouter, Routes, Route } from "react-router-dom";
//Pages
import Home from "./pages/Home.jsx";
//Components
import Header from "./components/Header/Header.jsx"
import Footer from "./components/Footer/Footer.jsx"
//Styles
import "./App.css"

export default function App() {
    return (
        <div className="App">
            <Header />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />}/>
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
    )
}