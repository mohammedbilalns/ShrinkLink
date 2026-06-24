import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import OtpForm from "../components/OtpForm";

const AuthPage = () => {
  const [formType, setFormType] = useState("login");
  const [registrationEmail, setRegistrationEmail] = useState("");

  const toggleForm = (type, email = "") => {
    setFormType(type);
    if (email) {
      setRegistrationEmail(email);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-emerald-50 to-teal-50">
       <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-4"> 
         ShrinkLink 
       </h1> 

      {formType === "login" ? (
        <LoginForm toggleForm={toggleForm} />
      ) : formType === "register" ? (
        <RegisterForm toggleForm={toggleForm} />
      ) : (
        <OtpForm toggleForm={toggleForm} email={registrationEmail} />
      )}
    </div>
  );
};

export default AuthPage;
