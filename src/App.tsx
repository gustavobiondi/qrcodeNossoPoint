import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
{/*import Carrinho from "./carrinho";*/}
import Cardapio from "./cardapio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<Login />} />
        {/*<Route path="/carrinho" element={<Carrinho />} />*/}
        <Route path="/cardapio" element={<Cardapio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
