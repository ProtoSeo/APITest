import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const handleInputNickname = (e) => {
    setNickname(e.target.value);
  };

  const onClickSignup = () => {
    axios
      .post("/api/v1/signup", {
        email: email,
        nickname: nickname,
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
        <label htmlFor="input_nickname">Nickname : </label>
        <input
          type="text"
          name="input_nickname"
          value={nickname}
          onChange={handleInputNickname}
        />
      </div>
      <div>
        <button type="button" onClick={onClickSignup}>
          Signup
        </button>
      </div>
    </div>
  );
}

export default Signup;
