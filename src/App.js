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
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Explore/>}/>
          <Route path="/sign-up" element={<SignUp/>}/>
          <Route path="/sign-in" element={<SignIn/>}/>
          
          <Route path='/profile' element={<PrivateRoute/>} >
            <Route path="/profile" element={<Profile/>}/>
          </Route>

          <Route path="/offers" element={<Offers/>}/>
          <Route path='/category/:categoryName' element={<Category/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/create-listing" element={<CreateListing />}/>
          <Route path="/edit-listing/:listingId" element={<EditListing />}/>
          <Route path="/contact/:landlordId" element={<Contact />}/>
          <Route path="/explore" element={<Explore/>}/>
          <Route path='/category/:categoryName/:listingId' element={<Listing/>}/>
        </Routes>
          <Navbar/>
      </Router>
      
      <ToastContainer/>
    </>
  );
}

export default App;
