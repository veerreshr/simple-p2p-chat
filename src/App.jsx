import { Routes, Route } from "react-router-dom";
import Home from "./Screens/Home";
import NotFound from "./Components/NotFound";
import RequireAuth from "./RequireAuth";
import LoginScreen from "./Screens/LoginScreen";
import ChatScreen from "./Screens/ChatScreen";
import NavBarComponent from "./Components/NavBarComponent";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBarComponent />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route element={<RequireAuth />}>
            <Route path="/chats" element={<ChatScreen />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
