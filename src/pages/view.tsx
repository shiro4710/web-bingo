import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/header";
import "twin.macro";

interface NumProps {
  number: number;
}

const bigStyle = css`
  width: 256px;
  height: 256px;
  border: 2px solid #296dff;
  text-align: center;
  line-height: 256px;
  font-size: 220px;
  margin: 0 4px;
`;

const BigNumber = (props: NumProps) => {
  return <div className={bigStyle}>{props.number}</div>;
};

const smallStyle = css`
  width: 78px;
  height: 78px;
  border: 1px solid #296dff;
  text-align: center;
  line-height: 78px;
  font-size: 48px;
  margin: 8px;
`;

const SmallNumber = (props: NumProps) => {
  return <div className={smallStyle}>{props.number}</div>;
};

const userStyle = css`
  background-color: #ebebeb;
  color: #1f1f1f;
`;

const AdminView = () => {
  const [roomName, setRoomName] = useState("");
  const [reachUsers, setReachUsers]: [string[], any] = useState([]);
  const [bingoUsers, setBingoUsers]: [string[], any] = useState([]);
  const [numbers, setNumbers]: [number[], any] = useState([]);
  const webSocketRef = useRef<WebSocket>();
  const [number, setNumber]: [[number, number], any] = useState([0, 0]);
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    console.log("websocket create");
    const socket = new WebSocket(
      "wss://ec2-18-183-120-252.ap-northeast-1.compute.amazonaws.com:8000"
    );
    webSocketRef.current = socket;

    socket.addEventListener("open", (event) => {
      const obj = {
        type: "login",
        user: "view",
      };

      socket.send(JSON.stringify(obj));
    });

    socket.addEventListener("message", (event) => {
      const obj = JSON.parse(event.data);

      if (obj["type"] === "connect") {
        setNumbers(obj["numbers"]);
        setRoomName(obj["roomName"]);
      }

      if (obj["type"] === "random-start") {
        // ルーレット開始
        intervalRef.current = setInterval(() => {
          setNumber([
            Math.floor(Math.random() * 10),
            Math.floor(Math.random() * 10),
          ]);
        }, 100);
      }

      if (obj["type"] === "random-stop") {
        clearInterval(intervalRef.current);
      }

      if (obj["type"] === "add") {
        clearInterval(intervalRef.current);
        setNumbers([...numbers, obj["number"] as number]);
        setNumber([Math.floor(obj["number"] / 10), obj["number"] % 10]);
        setReachUsers(obj["reachs"]);
        setBingoUsers(obj["bingos"]);
      }

      if (obj["type"] === "reset") {
        location.reload();
      }
    });

    return () => socket.close();
  }, numbers);

  return (
    <div tw="text-center">
      <PageHeader />
      <div tw="text-4xl">{roomName}</div>
      <div tw="text-xl">
        <div tw="my-4">
          <div>リーチ: {reachUsers.length}</div>
          <div tw="flex justify-center">
            {reachUsers.map((user) => (
              <div className={userStyle} key={user} tw="mx-2 px-1 rounded">
                {user}
              </div>
            ))}
          </div>
        </div>
        <div tw="my-4">
          <div>ビンゴ: {bingoUsers.length}</div>
          <div tw="flex justify-center">
            {bingoUsers.map((user) => (
              <div className={userStyle} key={user} tw="mx-2 px-1 rounded">
                {user}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div tw="flex justify-center">
        <BigNumber number={number[0]} />
        <BigNumber number={number[1]} />
      </div>
      <div tw="px-20 my-6 flex flex-wrap items-start">
        {numbers.map((num) => (
          <SmallNumber key={num} number={num} />
        ))}
      </div>
    </div>
  );
};

export default AdminView;
