import { css } from "@emotion/css";
import { PageHeader } from "@/components/header";
import "twin.macro";
import { useEffect, useRef, useState } from "react";

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
  const roomName = "ルーム名";
  const reachUsers: string[] = ["aa user", "ab user"];
  const bingoUsers: string[] = ["bb user"];
  const numbers = [
    1, 2, 5, 6, 78, 9, 10, 1, 2, 5, 6, 78, 9, 10, 1, 2, 5, 6, 78, 9, 10, 1, 2,
    5, 6, 78, 9, 10, 1, 2, 5, 6, 78, 9, 10, 1, 2, 5, 6, 78, 9, 10,
  ];
  const [message, setMessage] = useState("");
  const webSocketRef = useRef<WebSocket>();

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    webSocketRef.current = socket;

    socket.addEventListener("message", (event) => {
      setMessage(event.data);
    });

    return () => socket.close();
  }, []);

  return (
    <div tw="text-center">
      <PageHeader />
      <div>{message}</div>
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
        <BigNumber number={0} />
        <BigNumber number={1} />
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
