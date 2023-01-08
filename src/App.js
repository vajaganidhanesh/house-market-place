import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Explore from "./pages/Explore";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import ForgotPassword from "./pages/ForgotPassword";
import Navbar from "./components/Navbar";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/offers" element={<Offers/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/explore" element={<Explore/>}/>
        </Routes>
          <Navbar/>
      </Router>
      
      <ToastContainer/>
    </>
  );
}

export default App;
