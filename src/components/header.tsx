import { css } from "@emotion/css";
import "twin.macro";
import tw from "twin.macro";

const barStyle = css`
  background-color: #4d4d4d;
  color: #ebebeb;
  a {
    ${tw`mx-2`}
  }
  span {
    background-color: #ebebeb;
    width: 2px;
    ${tw`mx-2 h-4`};
  }
`;

export const PageHeader = () => {
  return (
    <header tw="sticky top-0 z-50">
      <div className={barStyle} tw="justify-between items-center text-center">
        <div tw="text-6xl tracking-wider">BINGO</div>
      </div>
    </header>
  );
};
