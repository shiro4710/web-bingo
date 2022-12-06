import { css } from "@emotion/css";
import "twin.macro";

const formStyle = css`
  * {
    border: 1px solid black;
    margin: 4px;
    padding: 4px;
  }
`;

const AdminConsole = () => {
  return (
    <div>
      <div className={formStyle}>
        <input type="text" />
        <button>add</button>
        <button>delete</button>
      </div>
      <div className={formStyle}>
        <button>start random</button>
      </div>
    </div>
  );
};

export default AdminConsole;
