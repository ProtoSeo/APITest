import React, { useState } from "react";
import axios from "axios";

function UploadLecture() {
  const [img, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const handleImg = (e) => {
    setImage(e.target.files[0]);
  };

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const onClickUpload = () => {
    const formData = new FormData();
    formData.append("image", img);
    formData.append("content", content);
    formData.append("title", title);

    axios
      .post(
        "http://localhost:8080/api/lecture",
        formData,
        // {
        //   thumbnail: formData,
        //   title: title,
        //   content: content,
        // }
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setImgUrl(res.data);
      })
      .catch((errors) => console.log(errors));
  };

  return (
    <div>
      <h2>Upload</h2>
      <div>
        <form encType="multipart/form">
          <textarea  onChange={handleTitle} rows="1" cols="50" />
          <br/>
          <textarea  onChange={handleContent} rows="4" cols="50"/>
          <br/>
          <input type="file" onChange={handleImg} />
          <br/>
          <button type="button" onClick={onClickUpload}>
            upload
          </button>
        </form>
      </div>
      <div>
        <img src={imgUrl} alt="upload img" width="70%" />
      </div>
    </div>
  );
}
export default UploadLecture;
