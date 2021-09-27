import React, { useState } from "react";
import axios from "axios";

function Upload(){
  const [img,setImage] = useState(null)
  const [imgUrl, setImgUrl] = useState("")
  const handleImg = (e) => {
    setImage(e.target.files[0]);
  };
  const onClickUpload = () => {
    const formData = new FormData();
    formData.append('data',img)
    axios
      .post("http://localhost:8080/api/v1/upload",
        formData
      , {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data)
        setImgUrl(res.data)
      })
      .catch((errors) => console.log(errors));
  };

  return (
    <div>
      <h2>Upload</h2>
      <div>
        <form encType="multipart/form">
          <input 
            type="file"
            onChange={handleImg}
            />
          <button type="button" onClick={onClickUpload}>upload</button>
        </form>
      </div>
      <div>
        <img src={imgUrl} alt="upload img"/>
      </div>
    </div>
  );
}
export default Upload;