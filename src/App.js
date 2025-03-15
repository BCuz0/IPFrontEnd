import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from './LandingPage';
import FilmsPage from "./FilmsPage";
import CustomerPage from "./CustomerPage";

function App() {
    return(
        <Router>
            <Routes>
                <Route exact path="/" element={<LandingPage />} />
                <Route path="/FilmsPage" element={<FilmsPage />} />
                <Route path="/CustomersPage" element={<CustomerPage />} />
            </Routes>
        </Router>
    )
}

export default App;