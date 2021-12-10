import React, {useState, uesEffect } from 'react';
import { useEffect } from 'react/cjs/react.development';
import styled from 'styled-components';
import { USER_ID } from '../../constants';
import { addProject } from '../../utils/ProfileAPIUtils'

const ProjectUpdateModalContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(0,0,0,0.4);
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
`;

const ProjectUpdateModal = styled.div`
  width: 40%;
  height: 60%;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
  z-index:100;
`;

const ModalCloseBtn = styled.button`
  top: 60%;
  left: 50%;
  position: relative;
  transform: translate(-50%, -50%);
`;

const ModalSaveBtn = styled.button`
  top: 60%;
  left: 40%;
  position: relative;
  transform: translate(-50%, -50%);
`;

function ProjectModal({changeState,data}) {
  const [title, setTitle] = useState("")
  const [introduce, setIntroduce] = useState("")
  const [content, setContent] = useState("")
  const [deployUrl, setDeployUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  useEffect(()=>{

  },[])

  const saveProject = () => {
    const userId = localStorage.getItem(USER_ID);
    const project = {
      title,
      content,
      introduce,
      "deploy_url": deployUrl,
      "github_url": githubUrl,
      "start_date": startDate,
      "end_date": endDate,
      "project_skills": [],
    }
    addProject({userId, project }).then((response) =>{
      if(response) {
        window.alert("정상적으로 저장 되었습니다.")
        changeState()
      }
    })
  }

  const handleTitle = (e) => setTitle(e.target.value);
  const handleIntroduce = (e) => setIntroduce(e.target.value);
  const handleContent = (e) => setContent(e.target.value);
  const handleDeployUrl = (e) => setDeployUrl(e.target.value);
  const handleGithubUrl = (e) => setGithubUrl(e.target.value);
  const handleStartDate = (e) => setStartDate(e.target.value);
  const handleEndDate = (e) => setEndDate(e.target.value);

  return (
    <ProjectUpdateModalContainer>
      <ProjectUpdateModal>
        <form>
          <label htmlFor="input-title">Title : </label>
          <input
            type="text"
            name="input-title"
            value={title}
            onChange={handleTitle}
          />
          <br />
          <label htmlFor="input-introduce">Introduce : </label>
          <input
            type="text"
            name="input-introduce"
            value={introduce}
            onChange={handleIntroduce}
          />
          <br />
          <label htmlFor="input-content">Content : </label>
          <input
            type="text"
            name="input-content"
            value={content}
            onChange={handleContent}
          />
          <br />
          <label htmlFor="input-deploy-url">Deploy URL : </label>
          <input
            type="text"
            name="input-deploy-url"
            value={deployUrl}
            onChange={handleDeployUrl}
          />
          <br />
          <label htmlFor="input-github-url">Github URL : </label>
          <input
            type="text"
            name="input-github-url"
            value={githubUrl}
            onChange={handleGithubUrl}
          />
          <br />
          <label htmlFor="input-start-date">StartDate : </label>
          <input
            type="date"
            name="input-introduce"
            value={startDate}
            onChange={handleStartDate}
          />
          <br />
          <label htmlFor="input-end-date">EndDate : </label>
          <input
            type="date"
            name="input-end-date"
            value={endDate}
            onChange={handleEndDate}
          />
          
        </form>
        <ModalSaveBtn onClick={saveProject}>Save</ModalSaveBtn>
        <ModalCloseBtn onClick={changeState}>Close</ModalCloseBtn>
      </ProjectUpdateModal>
    </ProjectUpdateModalContainer>
  );
}

export default ProjectModal;