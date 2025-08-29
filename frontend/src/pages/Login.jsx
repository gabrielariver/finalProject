import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "/auth/github";
  };

  return (
    <div>
      <h1>Hábitos & Rachas</h1>
      <button onClick={handleLogin}>Iniciar sesión con GitHub</button>
    </div>
  );
};

export default Login;
