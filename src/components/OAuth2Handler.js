import React from "react";
import { ACCESS_TOKEN, USER_ID, UUID } from "../constants";
import { Redirect } from "react-router-dom";

function OAuth2Handler({location}) {
  const getUrlParameter = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");

    var results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const accessToken = getUrlParameter(ACCESS_TOKEN);
  const refreshToken = getUrlParameter(UUID);
  const userId = getUrlParameter(USER_ID);
  const error = getUrlParameter("error");

  if (accessToken) {
    localStorage.setItem(USER_ID,userId);
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(UUID, refreshToken);
    return (
      <Redirect
        to={{
          pathname: "/profile",
          state: { from: location },
        }}
      />
    );
  } else {
    return (
      <Redirect
        to={{
          pathname: "/login",
          state: {
            from: location,
            error: error,
          },
        }}
      />
    );
  }
}

export default OAuth2Handler;
