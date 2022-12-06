import "twin.macro";
import { css } from "@emotion/css";
import tw from "twin.macro";
import { CardComponent } from "@/components/card/card";
import { PageHeader } from "@/components/header";

const Card = () => {
  const numbers = [
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [5, 10, 15, 20, 25],
  ];
  const roomName = "ルーム名";
  const userName = "ユーザー名";
  const isReach = false;
  const isBingo = false;
  const statusStyle = css`
    ${tw`text-2xl my-6 ${isBingo || isReach ? "underline" : ""}`}
  `;

  return (
    <div>
      <PageHeader />
      <div tw="text-center my-4">
        <div tw="text-3xl my-1">{roomName}</div>
        <div tw="text-xl my-1">{userName}</div>
        <div className={statusStyle}>
          {isBingo ? "ビンゴ!" : isReach ? "リーチ!" : "　"}
        </div>
      </div>
      <CardComponent numbers={numbers} />
    </div>
  );
};

export default Card;
