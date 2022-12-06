import "twin.macro";
import { css } from "@emotion/css";

interface CellProps {
  number: number;
  isOpened: boolean;
}

const cellStyle = css`
  width: 64px;
  height: 64px;
  border: 1px solid #296dff;
  text-align: center;
  line-height: 64px;
  font-size: 24px;
`;

const CardCell = (props: CellProps) => {
  return (
    <div className={cellStyle} tw="text-center">
      {props.number}
    </div>
  );
};

interface CardProps {
  numbers: number[][];
}

export const CardComponent = (props: CardProps) => {
  return (
    <div>
      {props.numbers.map((ns) => (
        <div key={ns.toString()} tw="flex justify-center">
          {ns.map((num) => (
            <CardCell key={num} number={num} isOpened={false} />
          ))}
        </div>
      ))}
    </div>
  );
};
