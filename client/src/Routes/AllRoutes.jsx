import Footer from "../Pages/Footer";
import Navbar from "../Pages/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import SelectBus from "../Pages/SelectBus";
import Details from "../Pages/Details";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import Myticket from "../Pages/Myticket";
import { Private } from "./Private";
import Bookseat from "../Pages/Bookseat";
import ForgetPassword from "../Pages/forgetpassword";
import VerifyOTP from "../Pages/VerifyOtp";
import ResetPassword from "../Pages/ResetPassword";

function AllRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/selectbus" element={<SelectBus />} />
        <Route path="/forget-password" element={<ForgetPassword/>}/>
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route
          path="/bookticket/:id"
          element={
            <Private>
              <Bookseat />
            </Private>
          }
        />
        <Route
          path="/details/:id"
          element={
            <Private>
              <Details />
            </Private>
          }
        />
        <Route
          path="/myticket"
          element={
            <Private>
              <Myticket />
            </Private>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default AllRoutes;
