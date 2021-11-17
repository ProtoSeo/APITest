import React, { useState, useRef, useEffect, useCallback } from "react";
import Video from "./Video";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

function MeetingRoom({ location }) {
  const [users, setUsers] = useState([]);
  const [localVideoState, setLocalVideoState] = useState(true);
  const [localAudioState, setLocalAudioState] = useState(true);
  const pcsRef = useRef({});
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const userId = location.state.userId;
  const roomId = location.state.roomId;

  const handleVideoState = () => {
    // TODO
    setLocalVideoState(!localVideoState);
    if (localVideoState) {
      console.log("video off");
      // localVideoTracks = localStream.getVideoTracks();
      // localVideoTracks.forEach(track => localStream.removeTrack(track));
    } else {
      console.log("video on");
      // localVideoTracks.forEach(track => localStream.addTrack(track));
    }
  };

  const handleAudioState = () => {
    // TODO
    setLocalAudioState(!localAudioState);
    localVideoRef.current.muted = !localAudioState;
    console.log(localAudioState, localVideoRef.current.muted);
  };

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;
      // ------------------------------------------------------------------------------
      // socketRef.current.emit("join", {
      //   room: "1234",
      //   email: "sample@naver.com",
      // });
      const msgJSON = JSON.stringify({
        roomId: roomId,
        userId: userId,
        type:"join"
      })
      socketRef.current.send(msgJSON);
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  // 상대방의 SocketID, UserID
  const createPeerConnection = useCallback((socketId, receiverId) => {
    try {
      const pc = new RTCPeerConnection(peerConnectionConfig);

      pc.onicecandidate = (e) => {
        if (!(socketRef.current && e.candidate)) return;
        console.log("onicecandidate");
        // --------------------------------------------------------------------
        // socketRef.current.emit("candidate", {
        //   candidate: e.candidate,
        //   candidateSendID: socketRef.current.id,
        //   candidateReceiveID: socketId,
        // });
        const msgJSON = JSON.stringify({
          userId:userId,
          receiverId:receiverId,
          roomId:roomId,
          type:"candidate",
          candidate: e.candidate
        });
        socketRef.current.send(msgJSON);
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.socketId !== socketId)
            .concat({
              socketId: socketId,
              userId: receiverId,
              stream: e.streams[0],
            })
        );
        console.log(users);
      };

      if (localStreamRef.current) {
        console.log("localstream add");
        localStreamRef.current.getTracks().forEach((track) => {
          if (!localStreamRef.current) return;
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.log("no local stream");
      }

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function allUser(allUsers) {
    allUsers.forEach(async (user) => {
      if (!localStreamRef.current) return;
      const pc = createPeerConnection(user.socketId, user.userId); // socketId, email
      if (!(pc && socketRef.current)) return;
      console.log(pcsRef.current)
      pcsRef.current = { ...pcsRef.current, [user.socketId]: pc };
      try {
        const localSdp = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        console.log("create offer success");
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        // --------------------------------------------------------------------------------
        // socketRef.current.emit("offer", {
        //   sdp: localSdp,
        //   offerSendID: socketRef.current.id,
        //   offerSendEmail: "offerSendSample@sample.com",
        //   offerReceiveID: user.id,
        // });
        const msgJSON = JSON.stringify({
          userId: userId,
          roomId: roomId,
          receiverId: user.userId,
          type:"offer",
          sdp: localSdp
        });
        socketRef.current.send(msgJSON);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async function getOffer(data) {
    const { sdp, socketId, receiverId } = data;
    console.log("get offer");
    if (!localStreamRef.current) return;
    const pc = createPeerConnection(socketId, receiverId);
    if (!(pc && socketRef.current)) return;
    pcsRef.current = { ...pcsRef.current, [socketId]: pc };
    try {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      console.log("answer set remote description success");
      const localSdp = await pc.createAnswer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pc.setLocalDescription(new RTCSessionDescription(localSdp));
      // --------------------------------------------------------------
      // socketRef.current.emit("answer", {
      //   sdp: localSdp,
      //   answerSendID: socketRef.current.id,
      //   answerReceiveID: offerSendID,
      // });
      const msgJSON = JSON.stringify({
        userId: userId,
        receiverId: receiverId,
        roomId: roomId,
        type: "answer",
        sdp: localSdp
      })

      socketRef.current.send(msgJSON);
    } catch (e) {
      console.error(e);
    }
  }

  function getAnswer(data) {
    const { sdp, socketId, receiverId } = data;
    console.log("get answer");
    const pc = pcsRef.current[socketId];
    if (!pc) return;
    pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  async function getCandidate(data) {
    const { candidate, socketId, receiverId } = data;
    console.log("get candidate");
    const pc = pcsRef.current[socketId];
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("candidate add success");
  }

  function userExit(socketId) {
    if (!pcsRef.current[socketId]) return;
    pcsRef.current[socketId].close();
    delete pcsRef.current[socketId];
    setUsers((oldUsers) => oldUsers.filter((user) => user.userId !== socketId));
  }

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080/meeting");
    getLocalStream();

    socketRef.current.onmessage = function (event) {
      var data = JSON.parse(event.data);
      var type = data.type;
      switch (type) {
        case "users":
          allUser(JSON.parse(data.data));
          break;
        case "getOffer":
          getOffer({
            sdp: data.sdp,
            socketId: data.socketId,
            receiverId: data.userId,
          });
          break;
        case "getAnswer":
          getAnswer({
            sdp: data.sdp,
            socketId: data.socketId,
            receiverId: data.receiverId,
          });
          break;
        case "getCandidate":
          getCandidate({ candidate: data.candidate, socketId: data.socketId, receiverId: data.receiverId });
          break;
        case "user_exit":
          userExit(data.socketId);
          break;
        default:
          break;
      }
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      users.forEach((user) => {
        if (!pcsRef.current[user.socketId]) return;
        pcsRef.current[user.socketId].close();
        delete pcsRef.current[user.socketId];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);

  return (
    <div>
      <p>RoomID : {roomId}</p>
      <p>UserID : {userId}</p>

      <div id="video">
        <video id="localVideo" ref={localVideoRef} autoPlay playsInline></video>
      </div>
      <div id="controlPanel">
        <button id="videoBtn" onClick={handleVideoState}>
          {localVideoState ? "Video On" : "Video Off"}
        </button>
        <button id="audioBtn" onClick={handleAudioState}>
          {localAudioState ? "Audio On" : "Audio Off"}
        </button>
        <button id="exitBtn">Exit</button>
      </div>
      <div id="remodeVideo">
        {users.map((user, index) => (
          <Video key={index} userId={user.userId} stream={user.stream} />
        ))}
      </div>
    </div>
  );
}

export default MeetingRoom;