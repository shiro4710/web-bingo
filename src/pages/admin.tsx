import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";
import "twin.macro";

const formStyle = css`
  * {
    border: 1px solid black;
    margin: 4px;
    padding: 4px;
  }
`;

const AdminConsole = () => {
  const webSocketRef = useRef<WebSocket>();
  const [numText, setNumText] = useState("");
  const [roomText, setRoomText] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("websocket create");
    const socket = new WebSocket("ws://bingo.f5.si:8000");
    webSocketRef.current = socket;

    socket.addEventListener("open", (event) => {
      const obj = { type: "login", user: "admin" };
      socket.send(JSON.stringify(obj));
    });

    socket.addEventListener("message", (event) => {
      const obj = JSON.parse(event.data);

      if (obj["type"] === "users") {
        console.log(obj["users"]);
        setUsers(obj["users"]);
      }
    });
    return () => socket.close();
  }, []);

  const onClickAddBtn = () => {
    const obj = {
      type: "add",
      number: numText,
    };
    if (webSocketRef.current !== undefined) {
      webSocketRef.current.send(JSON.stringify(obj));
    }
  };
  const onClickRandomStartBtn = () => {
    const obj = {
      type: "random-start",
    };
    if (webSocketRef.current !== undefined) {
      webSocketRef.current.send(JSON.stringify(obj));
    }
  };
  const onClickRandomStopBtn = () => {
    const obj = {
      type: "random-stop",
    };
    if (webSocketRef.current !== undefined) {
      webSocketRef.current.send(JSON.stringify(obj));
    }
  };

  const onClickResetBtn = () => {
    const obj = {
      type: "reset",
    };
    if (webSocketRef.current !== undefined) {
      webSocketRef.current.send(JSON.stringify(obj));
    }
  };

  const onClickRoomSetBtn = () => {
    const obj = {
      type: "room",
      roomName: roomText,
    };
    if (webSocketRef.current !== undefined) {
      webSocketRef.current.send(JSON.stringify(obj));
    }
  };

  return (
    <div>
      <div className={formStyle}>
        <button onClick={() => onClickRandomStartBtn()}>start random</button>
        <button onClick={() => onClickRandomStopBtn()}>stop random</button>
      </div>
      <div className={formStyle}>
        <button onClick={() => onClickResetBtn()}>reset</button>
      </div>
      <div className={formStyle}>
        <input
          type="text"
          value={roomText}
          onChange={(event) => setRoomText(event.target.value)}
        />
        <button onClick={() => onClickRoomSetBtn()}>set</button>
      </div>
      <div tw="text-xl">
        <div>{users.length}</div>
        <div>{users.join(", ")}</div>
      </div>
    </div>
  );
};

export default AdminConsole;
