import React, { useState } from "react";
import axios from "axios";

function Upload(){
  const [formData, setFormData] = useState(new FormData());
  const handleFormData = (e) => {
    setFormData(e.target.files[0]);
  };
  const headers = {
    "Content-Type": "multipart/form-data"
  };
  const onClickUpload = () => {
    console.log("onclickUpload")
    axios
      .post("http://localhost:8080/api/v1/upload",{
        data:formData
      },{headers})
      .then((res) => console.log(res))
      .catch((errors) => console.log(errors));
  };

  return (
    <div>
      <h2>Upload</h2>
      <div>
        <input 
          type="file"
          onChange={handleFormData}
          formEncType="multipart/form-data"
          />
        <button type="button" onClick={onClickUpload}>upload</button>
      </div>
    </div>
  );
}
export default Upload;