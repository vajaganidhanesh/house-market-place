import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Spinner from "./components/Spinner";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Listing = lazy(() => import("./pages/Listing"));
const Contact = lazy(() => import("./pages/Contact"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const EditListing = lazy(() => import("./pages/EditListing"));

function ErrorfallBack({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Adjust height as needed
      }}
    >
      <p style={{ fontWeight: "bold" }}>Looks like Something went wrong</p>
      <button
        style={{ minWidth: "200px" }}
        className="primaryButton"
        onClick={resetErrorBoundary}
      >
        Please Click here to refresh the website
      </button>
    </div>
  );
}

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorfallBack} onReset={() => {}}>
        <Suspense fallback={<Spinner />}>
          <Router>
            <Routes>
              <Route path="/" element={<Explore />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />

              <Route path="/profile" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/offers" element={<Offers />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route
                path="/edit-listing/:listingId"
                element={<EditListing />}
              />
              <Route path="/contact/:landlordId" element={<Contact />} />
              <Route path="/explore" element={<Explore />} />
              <Route
                path="/category/:categoryName/:listingId"
                element={<Listing />}
              />
            </Routes>
            <Navbar />
          </Router>
          <ToastContainer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
