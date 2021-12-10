import React, { useEffect, useState } from "react";
import { USER_ID } from "../../constants";
import {
  getProfile,
  getSkillList,
  addUserSkill,
} from "../../utils/ProfileAPIUtils";
import ProfileProject from "./ProfileProject";
import ProfileUserSkill from "./ProfileUserSkill";
import ProjectModal from "./ProjectModal";

function Profile() {
  const [nickname, setNickname] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [bojId, setBojId] = useState("");
  const [selectSkill, setSelectSkill] = useState("");
  const [projects, setProjects] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [projectModalState, setProjectModalState] = useState(false);
  const [nicknameState, setNicknameState] = useState(false);
  const [blogUrlState, setBlogUrlState] = useState(false);
  const [githubUrlState, setGithubUrlState] = useState(false);
  const [bojIdState, setBojIdState] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem(USER_ID);
    getProfile(userId).then((response) => {
      if (response) {
        setNickname(response.nickname);
        setImageUrl(response.image_url);
        setGithubUrl(response.github_url);
        setBlogUrl(response.blog_url);
        setBojId(response.baekjoon_id);
        setProjects(response.projects);
        setUserSkills(response.user_skills);
      }
    });
    getSkillList().then((response) => {
      if (response) {
        setSkillList(response);
      }
    });
  }, []);

  const changeUserProfileImage = () => {
    console.log("changeUserProfileImage");
  };

  const onClickAddUserSkill = () => {
    addUserSkill(selectSkill).then((response)=> {
      if(response) {
        
      }
    });
  };

  const changeProjectState = () => setProjectModalState(!projectModalState);
  const changeNicknameState = () => setNicknameState(!nicknameState);
  const changeBlogUrlState = () => setBlogUrlState(!blogUrlState);
  const changeGithubUrlState = () => setGithubUrlState(!githubUrlState);
  const changeBojIdState = () => setBojIdState(!bojIdState);

  const handleNickname = (e) => setNickname(e.target.value);
  const handleBlogUrl = (e) => setBlogUrl(e.target.value);
  const handleGithubUrl = (e) => setGithubUrl(e.target.value);
  const handleBojId = (e) => setBojId(e.target.value);
  const handleSelected = (e) => setSelectSkill(e.target.value);

  return (
    <div>
      <div>
        <div>
          <img src={imageUrl} alt="ProfileImage" width="160px" height="160px" />
          <button onClick={changeUserProfileImage}>Profile Image Change</button>
        </div>
        <div>
          <p>nickname : {nickname}</p>
          {nicknameState && (
            <div>
              <input
                type="text"
                name="input-nickname"
                onChange={handleNickname}
              />
              <button>save</button>
            </div>
          )}
          <button onClick={changeNicknameState}>update</button>
        </div>
        <div>
          <p>Blog : {blogUrl}</p>
          {blogUrlState && (
            <div>
              <input
                type="text"
                name="input-blog-url"
                onChange={handleBlogUrl}
              />
              <button>save</button>
            </div>
          )}
          <button onClick={changeBlogUrlState}>update</button>
        </div>
        <div>
          <p>Github : {githubUrl}</p>
          {githubUrlState && (
            <div>
              <input
                type="text"
                name="input-github-url"
                onChange={handleGithubUrl}
              />
              <button>save</button>
            </div>
          )}
          <button onClick={changeGithubUrlState}>update</button>
        </div>
        <div>
          <p>boj ID : {bojId}</p>
          {bojIdState && (
            <div>
              <input type="text" name="input-boj-id" onChange={handleBojId} />
              <button>save</button>
            </div>
          )}
          <button onClick={changeBojIdState}>update</button>
        </div>

        {projects.map((project) => ProfileProject(project.id, project))}
        <button onClick={changeProjectState}>Add Project</button>
        {projectModalState && (
          <ProjectModal changeState={changeProjectState}></ProjectModal>
        )}
        <hr />

        {userSkills.map((skill) => ProfileUserSkill(skill))}
        <select onChange={handleSelected} value={selectSkill}>
          <option value="">Select</option>
          {skillList.map((skill) => (
            <option key={skill.skill_id} value={skill.skill_name}>
              {skill.skill_name}
            </option>
          ))}
        </select>
        <button onClick={onClickAddUserSkill}>save</button>
      </div>
    </div>
  );
}

export default Profile;
