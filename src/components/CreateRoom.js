import React, { useState }  from "react";
import { Link } from "react-router-dom";

function Room(id){
  return (
    <div>
      <Link to={{ pathname: "/meeting-room", state: { roomId: id } }}>
        {id}
      </Link>
    </div>
  );
}
function CreateRoom() {
  const [roomIds, setRoomIds] = useState([]);
  const [roomId, setRoomId] = useState(0);
  
  const handleRoomId = (e) => {
    setRoomId(e.target.value)
  }

  const addRoomId = () => {
    const set = new Set(roomIds);
    set.add(roomId);
    setRoomIds([...set]);
  };
  return (
    <div>
      <div>
        <input
          type="number"
          name="inputNumber"
          value={roomId}
          onChange={handleRoomId}
        />
        <button onClick={addRoomId}>Create Select Room Number</button>
      </div>
      <div>
        {roomIds.map((a) =>Room(a))}
      </div>
    </div>
  );
}

export default CreateRoom;