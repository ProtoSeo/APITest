import React, { useState, useRef, useEffect, useCallback } from "react";


function Notification() {
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const userId = 1;

  function sendUserId() {
    const msgJSON = JSON.stringify({
      type : "receiveUserId" ,
      userId: userId
    })
    socketRef.current.send(msgJSON);
  }

  function receiveNotifications(data) {
    setNotifications(data);
  }

  useEffect(()=>{
    socketRef.current = new WebSocket("ws://localhost:8080/notifications")
  
    socketRef.current.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var type = data.type;
     
      switch (type) {
        case "sendUserId":
          sendUserId();
          break;
        case "sendNotification":
          receiveNotifications(data.notifications);
          break;
        default:
          break;
      }
    }
  },[])

  return (
    <div>{notifications.length}</div>
  );
}

export default Notification;