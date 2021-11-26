import React, { useState, useRef, useEffect } from "react";
function Chat({ msg, senderId, receiverId }) {
  return (
    <div>
      <p>{msg}, sender : {senderId}, receiver : {receiverId}</p>
    </div>
  );
}

function Chatting() {
  const socketRef = useRef(null);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const userId = 1;
  const receiverId = 2;
  const chatRoomId = 1;
  const handleInputMessage = (e) => {
    setMessage(e.target.value);
  };
  function sendUserId() {
    const msgJSON = JSON.stringify({
      type: "receiveUserId",
      userId: userId,
    });
    socketRef.current.send(msgJSON);
  }

  const onClickSend = () => {
    const msgJSON = JSON.stringify({
      type: "sendChat",
      chatRoomId: chatRoomId,
      senderId: userId,
      receiverId: receiverId,
      message: message,
    });
    socketRef.current.send(msgJSON);
    setChat([...chat, {message, userId, receiverId}])
  };
  function receiveChat({message, senderId, receiverId}) {
    console.log(message);
    // Chatting 리스트에 put하면됨
    setChat([...chat,{message, senderId, receiverId}])
  }
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080/chat");

    socketRef.current.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var type = data.type;
      var senderId = data.senderId;
      var receiverId = data.receiverId;
      var message = data.message;
      switch (type) {
        case "sendUserId":
          sendUserId();
          break;
        case "receiveChat":
          receiveChat({message, senderId, receiverId})
          break;
        default:
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>
        {chat.map((message, senderId, receiverId) =>
          Chat({ message, senderId, receiverId })
        )}
      </div>
      <div>
      <input
          type="text"
          name="input_email"
          value={message}
          onChange={handleInputMessage}
        />
        <button type="button" onClick={onClickSend}>
          send
        </button>
      </div>
    </div>
  );
}
export default Chatting;
