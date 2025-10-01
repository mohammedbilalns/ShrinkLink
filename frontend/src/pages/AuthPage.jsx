import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [formType, setFormType] = useState("login"); 

  const toggleForm = (type) => {
    setFormType(type);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-[#f3f4ff] to-[#e0f7fa]">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
        LinkShrink
      </h1>
      <p className="text-lg text-center mb-10 max-w-md">
        Join us and start shortening your links
      </p>
      {formType === "login" ? (
        <LoginForm toggleForm={toggleForm} />
      ) : (
        <RegisterForm toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthPage;
