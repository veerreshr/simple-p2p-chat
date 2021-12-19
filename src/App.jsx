import { Routes, Route } from "react-router-dom";
import Home from "./Screens/Home";
import NotFound from "./Components/NotFound";
import RequireAuth from "./RequireAuth";
import LoginScreen from "./Screens/LoginScreen";
import ChatScreen from "./Screens/ChatScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<RequireAuth />}>
        <Route path="/chats" element={<ChatScreen />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
