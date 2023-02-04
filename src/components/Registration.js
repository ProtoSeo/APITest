import React, { useState, useRef, useEffect } from "react";
import { preRegistration } from "../utils/APIUtils";

function Registration() {

  const [email, setEmail] = useState("");

  const handleInputEmail = (e) => {
    setEmail(e.target.value);
  };

  const onClickRegistration = () => {
    preRegistration({ email }).then((response) => {
      if (response) {
        console.log("pre registration Success")
      }
    });
  };

  return (
    <div>
      <h2>pre registration</h2>
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
          <button type="button" onClick={onClickRegistration}>
            registration
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registration;