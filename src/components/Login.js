import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const onClickLogin = () => {
    console.log("email: " + email + " passowrd:" + password);
    axios
      .post("/api/v1/login", {
        email: email,
        password: password,
      })
      .then((res) => console.log(res))
      .catch((errors) => console.log(errors));
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label htmlFor="input_email">Email : </label>
        <input
          type="text"
          name="input_email"
          value={email}
          onChange={handleInputEmail}
        />
      </div>
      <div>
        <label htmlFor="input_password">Password : </label>
        <input
          type="password"
          name="input_password"
          value={password}
          onChange={handleInputPassword}
        />
      </div>

      <div>
        <button type="button" onClick={onClickLogin}>
          Login
        </button>
      </div>

      <div>
        <Link to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Login;
