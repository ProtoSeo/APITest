import React, { useState, useEffect } from "react";

function ProfileUserSkill(skill) {
  // const [skillId, setSkillId] = useState(0);
  // const [name, setName] = useState("");
  // const [color, setColor] = useState("");
  // const [textColor, setTextColor] = useState("");

  // useEffect(()=>{
  //   setSkillId(skill.skill_id)
  //   setName(skill.skill_name)
  //   setColor(skill.color)
  //   setTextColor(skill.text_color)
  // },[]);

  return (
    <div key={skill.skill_id}>
      <ul>
        <li>name : {skill.skill_name}</li>
      </ul>
    </div>
  );
}

export default ProfileUserSkill;
