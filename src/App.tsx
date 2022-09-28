import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./Components/Header";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="movies/:id" element={<Home />} />
        <Route path="/tv" element={<Tv />}></Route>
        <Route path="/tv/:id" element={<Tv />} />

        <Route path="search" element={<Search />}></Route>
      </Routes>
    </Router>
  );
}
