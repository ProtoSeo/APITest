import React ,{useState, useEffect} from "react";

function ProfileProject(id, project) {
  // const [projectId, setProjectId] = useState(0);
  // const [title, setTitle] = useState("");
  // const [introduce, setIntroduce] = useState("");
  // const [content, setContent] = useState("");
  // const [textColor, setTextColor] = useState("");
  

  return (
    <div key={id}>
      <hr />
      <ul>
        <li>title : {project.title}</li>
        <li>introduce : {project.introduce}</li>
        <li>content : {project.content}</li>
        <li>githubUrl : {project.github_url}</li>
        <li>deployUrl : {project.deploy_url}</li>
        <li>startDate : {project.start_date}</li>
        <li>endDate : {project.end_date}</li>
        <button>change</button>
      </ul>
    </div>
  );
}

export default ProfileProject;