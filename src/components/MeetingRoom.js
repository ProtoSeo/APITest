import React, { useState } from "react";

const peerConnectionConfig = {
  'iceServers': [
      {'urls': 'stun:stun.stunprotocol.org:3478'},
      {'urls': 'stun:stun.l.google.com:19302'},
  ]
}

const socket = new WebSocket("ws://localhost:8080/meeting");
const myPeerConnection = new RTCPeerConnection(peerConnectionConfig);

socket.addEventListener('open',function(event){
  socket.send("hello World");
})

socket.addEventListener('message',function(message){
  console.log(message)
})

function close() {
  socket.close();
}

function MeetingRoom() {
  const [response, setResponse] = useState("");
  
function send(){
  setResponse("hello")
  socket.send("hello");
}  

    return (
      <div>
        <p>hello:{response}</p>
        <video id="video" playsinline autoplay></video>
        <button onClick={send}>send</button>
        <button onClick={close}>close</button>
      </div>
      )
}

export default MeetingRoom;