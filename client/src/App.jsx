import { useState } from "react";
import Login from "../components/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../components/Register";
import Home from "../components/Home";

function App() {
  const [token, setToken] = useState("");

  const saveToken = (str) => {
    setToken(str);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login saveToken={saveToken}/>} />
          <Route path="/register" element={<Register/>} />
          <Route path={"/home"} element={<Home token={token}/> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
