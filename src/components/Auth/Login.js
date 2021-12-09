import React, { useState } from "react";
import {
  GOOGLE_AUTH_URL,
  GITHUB_AUTH_URL,
  ACCESS_TOKEN,
  UUID,
  USER_ID,
} from "../../constants";
import { login } from "../../utils/APIUtils";
import googleLogo from "../../img/google-logo.png";
import githubLogo from "../../img/github-logo.png";
import { Link } from "react-router-dom"

function Login({location, history}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setPassword(e.target.value);
  };

  const onClickLogin = () => {
    login({ email, password }).then((response) => {
      if (response) {
        localStorage.setItem(ACCESS_TOKEN, response.access_token);
        localStorage.setItem(UUID, response.uuid);
        localStorage.setItem(USER_ID, response.user_id);
        history.push('/profile')
      }
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="input-email">Email : </label>
          <input
            type="text"
            name="input_email"
            value={email}
            onChange={handleInputEmail}
          />
        </div>
        <div>
          <label htmlFor="input-password">Password : </label>
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
          <button type="button">
            <Link
              to={{
                pathname: "/signup",
                state: { from: location },
              }}>
              Signup
            </Link>
          </button>
        </div>
      </form>
      <h2>OAuth2 Login</h2>
      <div className="social-login">
        <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
          <img src={googleLogo} alt="Google" /> Log in with Google
        </a>
        <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
          <img src={githubLogo} alt="Github" /> Log in with Github
        </a>
      </div>
    </div>
  );
}

export default Login;
