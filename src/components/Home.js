import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/signup">Signup</Link>
      </div>
      <div>
        <Link to="/upload">Upload</Link>
      </div>
      <div>
        <Link to="/upload-lecture">UploadLecture</Link>
      </div>
      <div>
        <Link to="/create-room">CreateRoom</Link>
      </div>
      <div>
        <Link to="/notifications">Notifications</Link>
      </div>
      <div>
        <Link to="/chatting">Chatting</Link>
      </div>
    </div>
  );
}

export default Home;