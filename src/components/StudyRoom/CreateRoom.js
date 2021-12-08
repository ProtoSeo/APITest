import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Room({ index, roomId, userId }) {
  return (
    <div key={index}>
      <Link
        to={{
          pathname: "/meeting-room-test",
          state: { roomId: roomId, userId: userId },
        }}
      >
        Room ID : {roomId}
      </Link>
    </div>
  );
}
function CreateRoom() {
  const [roomIds, setRoomIds] = useState([]);
  const [roomId, setRoomId] = useState(0);
  const [userId, setUserId] = useState(0);

  const handleRoomId = (e) => {
    setRoomId(e.target.value);
  };
  const handleUserId = (e) => {
    setUserId(e.target.value);
  };
  const addRoomId = () => {
    axios
      .post("http://localhost:8080/api/v1/rooms", null, {
        params: { "room-id": roomId },
      })
      .then((res) => console.log(res))
      .catch((errors) => console.log(errors));
    const set = new Set(roomIds);
    set.add(roomId);
    setRoomIds([...set]);
  };
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/rooms")
      .then((res) => {
        setRoomIds(res.data);
        console.log(res);
      })
      .catch((errors) => console.log(errors));
  }, []);
  return (
    <div>
      <div>
        <input
          type="number"
          name="inputRoomId"
          value={roomId}
          onChange={handleRoomId}
        />
        <button onClick={addRoomId}>Create Select Room Number</button>
      </div>
      <hr />
      <div>
        <label>UserID : </label>
        <input
          type="number"
          name="inputUserId"
          value={userId}
          onChange={handleUserId}
        />
      </div>
      <div>
        {roomIds.map((roomId, index) => Room({ index, roomId, userId }))}
      </div>
    </div>
  );
}

export default CreateRoom;