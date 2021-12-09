import React, { useEffect, useState } from "react";
import { USER_ID } from "../../constants";
import { getProfile } from '../../utils/ProfileAPIUtils'
import ProfileProject from './ProfileProject'
import ProfileUserSkill from './ProfileUserSkill'
import ProjectModal from './ProjectModal'

function Profile() {
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [bojId, setBojId] = useState("");
  const [projects, setProjects] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [projectModalState, setProjectModalState] = useState(false);
  
  useEffect(() => {
    const userId = localStorage.getItem(USER_ID);
    getProfile(userId).then((response) => {
      if(response) {
        setNickname(response.nickname)
        setImageUrl(response.image_url)
        setGithubUrl(response.github_url)
        setBlogUrl(response.blog_url)
        setBojId(response.baekjoon_id)
        setProjects(response.projects)
        setUserSkills(response.user_skills)
        console.log(response)
      }
    })
  }, []);

  const changeUserProfileImage = () => {
    console.log("changeUserProfileImage")
  };

  const changeProjectModalState = () => {
    setProjectModalState(!projectModalState);
  }
  return (
    <div>
      <div>
        <div>
          <img src={imageUrl} alt="ProfileImage" width="160px" height="160px" />
          <button onClick={changeUserProfileImage}>Profile Image Change</button>
        </div>
        
          <p>nickname : {nickname}</p> <button>temp</button>
          <p>Blog : {blogUrl}</p>
          <p>Github : {githubUrl}</p>
          <p>boj ID : {bojId}</p>
          {projects.map((project) => ProfileProject(project.id, project))}
          <button onClick={changeProjectModalState}>Add Project</button>
          {projectModalState && (
            <ProjectModal
              changeProjectModalState={changeProjectModalState}
            ></ProjectModal>
          )}
          <hr/>
          {userSkills.map((skill) => ProfileUserSkill(skill))}
          <button>Add Skill</button>
        
      </div>

      <div>
        <button>Edit</button>
      </div>
    </div>
  );
}

export default Profile;