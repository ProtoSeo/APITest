import React, { useState, useRef, useEffect, useCallback } from "react";
import Video from "./Video";

const peerConnectionConfig = {
  iceServers: [
    { urls: "stun:stun.stunprotocol.org:3478" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

function MeetingRoom({ history, location }) {
  const [users, setUsers] = useState([]);
  const [localVideoState, setLocalVideoState] = useState(true);
  const [localAudioState, setLocalAudioState] = useState(true);
  const [shareLocalScreen, setShareLocalScreen] = useState(false);
  const pcsRef = useRef({});
  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const localScreenVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const localScreenStreamRef = useRef(null);
  const userId = location.state.userId;
  const roomId = location.state.roomId;
  const localVideoTracks = useRef(null);

  const handleVideoState = () => {
    setLocalVideoState(!localVideoState);
    if (localVideoState) {
      console.log("video off");
      localVideoTracks.current = localStreamRef.current.getVideoTracks();
      localVideoTracks.current.forEach((track) =>
        localStreamRef.current.removeTrack(track)
      );
    } else {
      console.log("video on");
      localVideoTracks.current.forEach((track) =>
        localStreamRef.current.addTrack(track)
      );
    }  
  };

  // TODO:
  const handleAudioState = () => {
    setLocalAudioState(!localAudioState);
    localVideoRef.current.muted = !localAudioState;
    console.log(localAudioState, localVideoRef.current.muted);
  };

  const leaveMeetingRoom = () => {
    const msgJSON = JSON.stringify({
      userId: userId,
      roomId: roomId,
      type: "disconnect",
    });
    socketRef.current.send(msgJSON);
    if (socketRef.current) socketRef.current.close();
    if (localVideoRef.current)
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    localVideoRef.current = null;
    if (localStreamRef.current) localStreamRef.current = null;
    if (localScreenVideoRef.current)
      localScreenVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
    localScreenVideoRef.current = null;
    if (localScreenStreamRef.current) localScreenStreamRef.current = null;
    history.goBack();
  };

  const changeStream = () => {
    setShareLocalScreen(!shareLocalScreen);
    if (!shareLocalScreen) {
      console.log("shareLocalScreen", shareLocalScreen);
      if (!localScreenStreamRef.current) {
        console.log("getLocalScreenStream");
        getLocalScreenStream();
      }
      for (let key in pcsRef.current) {
        let sender = pcsRef.current[key].getSenders().find((s) => {
          return s.track.kind === "video";
        });
        sender.replaceTrack(localScreenStreamRef.current.getTracks()[0]);
      }
    } else {
      for (let key in pcsRef.current) {
        let sender = pcsRef.current[key].getSenders().find((s) => {
          return s.track.kind === "video";
        });
        sender.replaceTrack(localStreamRef.current.getTracks().find(track => track.kind === 'video'));
      }
    }
  };

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 320,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef.current) return;
      const msgJSON = JSON.stringify({
        roomId: roomId,
        userId: userId,
        type: "join",
      });
      socketRef.current.send(msgJSON);
    } catch (e) {
      console.log(`getUserMedia error: ${e}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocalScreenStream = useCallback(async () => {
    try {
      const localScreenStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: {
          width: 320,
          height: 240,
        },
      });
      localScreenStreamRef.current = localScreenStream;
      if (localScreenVideoRef.current)
        localScreenVideoRef.current.srcObject = localScreenStream;
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
        const msgJSON = JSON.stringify({
          userId: userId,
          receiverId: receiverId,
          roomId: roomId,
          type: "candidate",
          candidate: e.candidate,
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
      console.log(pcsRef.current);
      pcsRef.current = { ...pcsRef.current, [user.socketId]: pc };
      try {
        const localSdp = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        console.log("create offer success");
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        const msgJSON = JSON.stringify({
          userId: userId,
          roomId: roomId,
          receiverId: user.userId,
          type: "offer",
          sdp: localSdp,
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
      const msgJSON = JSON.stringify({
        userId: userId,
        receiverId: receiverId,
        roomId: roomId,
        type: "answer",
        sdp: localSdp,
      });

      socketRef.current.send(msgJSON);
    } catch (e) {
      console.error(e);
    }
  }

  function getAnswer(data) {
    const { sdp, socketId } = data;
    console.log("get answer");
    const pc = pcsRef.current[socketId];
    if (!pc) return;
    pc.setRemoteDescription(new RTCSessionDescription(sdp));
  }

  const getCandidate = async (data) => {
    const { candidate, socketId } = data;
    console.log("get candidate");
    const pc = pcsRef.current[socketId];
    if (!pc) return;
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log("candidate add success");
  };

  function userExit(socketId) {
    if (!pcsRef.current[socketId]) return;
    pcsRef.current[socketId].onicecandidate = null;
    pcsRef.current[socketId].ontrack = null;
    pcsRef.current[socketId].onnegotiationneeded = null;
    pcsRef.current[socketId].oniceconnectionstatechange = null;
    pcsRef.current[socketId].onsignalingstatechange = null;
    pcsRef.current[socketId].onicegatheringstatechange = null;
    pcsRef.current[socketId].onnotificationneeded = null;
    pcsRef.current[socketId].onremovetrack = null;
    pcsRef.current[socketId].close();
    delete pcsRef.current[socketId];
    setUsers((oldUsers) =>
      oldUsers.filter((user) => user.socketId !== socketId)
    );
  }

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080/meeting");
    getLocalStream();
    getLocalScreenStream();
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
          getCandidate({
            candidate: data.candidate,
            socketId: data.socketId,
            receiverId: data.receiverId,
          });
          break;
        case "userExit":
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
      {/* TODO: 껏다켜면 Stream 이 먹히는 것 같은 현상 해결해야함 */}
      {localVideoState ? (
        <div id="video">
          <video
            id="localVideo"
            ref={localVideoRef}
            autoPlay
            playsInline
            height="240px"
            width="320px"
          ></video>
        </div>
      ) : (
        <div></div>
      )}
      <div id="screenVideo">
        <video
          id="screenVideo"
          ref={localScreenVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div id="controlPanel">
        <button id="videoBtn" onClick={handleVideoState}>
          {localVideoState ? "Video On" : "Video Off"}
        </button>
        <button id="audioBtn" onClick={handleAudioState}>
          {localAudioState ? "Audio On" : "Audio Off"}
        </button>
        <button id="exitBtn" onClick={leaveMeetingRoom}>
          Exit
        </button>
        <button id="changeBtn" onClick={changeStream}>
          Change Video
        </button>
      </div>
      <div id="remodeVideo">
        {users.map((user, index) => (
          <Video
            key={index}
            socketId={user.socketId}
            userId={user.userId}
            stream={user.stream}
          />
        ))}
      </div>
    </div>
  );
}

export default MeetingRoom;
