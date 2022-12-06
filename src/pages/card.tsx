import "twin.macro";
import { css } from "@emotion/css";
import { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { CardComponent } from "@/components/card/card";
import { PageHeader } from "@/components/header";

const formStyle = css`
  border: 1px solid black;
`;

const Card = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [status, setStatus] = useState("　");
  const statusStyle = css`
    ${tw`text-2xl my-6`}
    ${status !== "　" ? tw`underline` : ""}
  `;
  const [numbers, setNumbers]: [number[], any] = useState([]);
  const [cardNums, setCardNums]: [number[][], any] = useState([]);
  const webSocketRef = useRef<WebSocket>();

  if (
    userName !== "" &&
    cardNums.length === 0 &&
    webSocketRef.current !== undefined
  ) {
    const obj = {
      type: "login",
      user: userName,
    };

    webSocketRef.current.send(JSON.stringify(obj));
  }

  useEffect(() => {
    console.log("websocket create");
    const socket = new WebSocket(
      "wss://ec2-18-183-120-252.ap-northeast-1.compute.amazonaws.com:8000"
    );
    webSocketRef.current = socket;

    socket.addEventListener("open", (event) => {
      if (userName !== "") {
        const obj = {
          type: "login",
          user: userName,
        };

        socket.send(JSON.stringify(obj));
      }
    });

    socket.addEventListener("message", (event) => {
      const obj = JSON.parse(event.data);
      console.log(obj);

      if (obj["type"] === "card") {
        setCardNums(obj["card"]);
      }

      if (obj["type"] === "connect") {
        setNumbers(obj["numbers"]);
        setRoomName(obj["roomName"]);
      }

      if (obj["type"] === "add") {
        console.log(obj["number"]);
        setNumbers([...numbers, obj["number"] as number]);
        if (obj["bingos"].includes(userName)) {
          setStatus("ビンゴ!");
        } else if (obj["reachs"].includes(userName)) {
          setStatus("リーチ!");
        }
      }

      if (obj["type"] === "reset") {
        location.reload();
      }
    });

    return () => socket.close();
  }, numbers);

  const isTurned = cardNums.map((v, i) => v.map((w, j) => numbers.includes(w)));

  const [inputText, setInputText] = useState("");

  return (
    <div>
      <PageHeader />
      {userName === "" ? (
        <div tw="text-xl text-center my-6">
          <div>ユーザー名を入力してください</div>
          <input
            type="text"
            tw="my-2"
            value={inputText}
            className={formStyle}
            onChange={(event) => setInputText(event.target.value)}
          />
          <br></br>
          <button
            tw="my-2"
            className={formStyle}
            onClick={() => {
              setUserName(inputText);
            }}
          >
            確定
          </button>
        </div>
      ) : (
        <>
          <div tw="text-center my-4">
            <div tw="text-3xl my-1">{roomName}</div>
            <div tw="text-xl my-1">{userName}</div>
            <div className={statusStyle}>{status}</div>
          </div>
          <CardComponent numbers={cardNums} isTurned={isTurned} />
        </>
      )}
    </div>
  );
};

export default Card;
