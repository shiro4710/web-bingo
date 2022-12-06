import WebSocket from "ws";

const wss = new WebSocket.Server({ port: 8000 });

let roomName = "";
let numbers: number[] = [0];
let clients: WebSocket.WebSocket[] = [];
let admins: WebSocket.WebSocket[] = [];
let userData: { [name: string]: number[][] } = {};

const broadcast = (wsArray: WebSocket.WebSocket[], msg: string) => {
  wsArray.map((c) => c.send(msg));
};

wss.on("connection", function connection(ws) {
  const obj = {
    type: "connect",
    numbers: numbers,
    roomName: roomName,
  };
  ws.send(JSON.stringify(obj));

  ws.on("message", (msg: string) => {
    const msgObj = JSON.parse(msg);

    if (msgObj["type"] === "room") {
      roomName = msgObj["roomName"];
    }

    if (msgObj["type"] === "login") {
      if (msgObj["user"] === "admin" || msgObj["user"] === "view") {
        admins.push(ws);
      } else {
        clients.push(ws);

        if (!(msgObj["user"] in userData)) {
          // カード生成
          const card: number[][] = [];
          for (let i = 0; i < 5; i++) {
            card[i] = [];
            for (let j = 0; j < 5; j++) {
              let num = getRandomInt(1 + 15 * i, 15 * (i + 1) + 1);
              while (card[i].includes(num)) {
                num = getRandomInt(1 + 15 * i, 15 * (i + 1) + 1);
              }
              card[i][j] = num;
            }
          }
          card[2][2] = 0;

          userData[msgObj["user"]] = card.map((v, i) =>
            v.map((w, j) => card[j][i])
          );
        }
        const sendObj = {
          type: "card",
          card: userData[msgObj["user"]],
        };
        ws.send(JSON.stringify(sendObj));
      }

      const sendAdUsersObj = {
        type: "users",
        users: Object.keys(userData),
      };
      broadcast(admins, JSON.stringify(sendAdUsersObj));
    }

    if (msgObj["type"] === "add") {
      addNumber(msgObj["number"]);
    }

    if (msgObj["type"] === "random-start") {
      broadcast(admins, JSON.stringify(msgObj));
    }

    if (msgObj["type"] === "random-stop") {
      broadcast(admins, JSON.stringify(msgObj));

      let num = getRandomInt(1, 75 + 1);
      while (numbers.includes(num)) {
        num = getRandomInt(1, 75 + 1);
      }

      addNumber(num);
    }

    if (msgObj["type"] === "reset") {
      numbers = [0];
      userData = {};

      broadcast(admins, JSON.stringify(msgObj));
      broadcast(clients, JSON.stringify(msgObj));
    }
  });

  ws.on("close", () => {
    clients = clients.filter((c) => c !== ws);
    admins = admins.filter((c) => c !== ws);
  });
});

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const addNumber = (num: number) => {
  numbers.push(num);

  // ビンゴ判定
  const bingoData = Object.keys(userData).map((userName) => {
    let reachNum = 0;
    let bingoNum = 0;
    const data = userData[userName];
    const isTurned = data.map((v, i) => v.map((w, j) => numbers.includes(w)));
    for (let i = 0; i < 5; i++) {
      let count = 0;
      for (let j = 0; j < 5; j++) {
        if (isTurned[i][j]) {
          count++;
        }
      }
      if (count === 4) {
        reachNum++;
      }
      if (count === 5) {
        bingoNum++;
        return { name: userName, reachNum: reachNum, bingoNum: bingoNum };
      }
    }
    for (let i = 0; i < 5; i++) {
      let count = 0;
      for (let j = 0; j < 5; j++) {
        if (isTurned[j][i]) {
          count++;
        }
      }
      if (count === 4) {
        reachNum++;
      }
      if (count === 5) {
        bingoNum++;
        return { name: userName, reachNum: reachNum, bingoNum: bingoNum };
      }
    }
    for (let i = 0; i < 5; i++) {
      let count = 0;
      if (isTurned[i][i]) {
        count++;
      }
      if (count === 4) {
        reachNum++;
      }
      if (count === 5) {
        bingoNum++;
        return { name: userName, reachNum: reachNum, bingoNum: bingoNum };
      }
    }
    for (let i = 0; i < 5; i++) {
      let count = 0;
      if (isTurned[i][4 - i]) {
        count++;
      }
      if (count === 4) {
        reachNum++;
      }
      if (count === 5) {
        bingoNum++;
        return { name: userName, reachNum: reachNum, bingoNum: bingoNum };
      }
    }
    return { name: userName, reachNum: reachNum, bingoNum: bingoNum };
  });

  // ビンゴ
  const bingoUsers = bingoData.filter((data) => data.bingoNum === 1);
  const reachUsers = bingoData.filter(
    (data) => data.bingoNum === 0 && data.reachNum !== 0
  );

  const msgObj = {
    type: "add",
    number: num,
    reachs: reachUsers.map((data) => data.name),
    bingos: bingoUsers.map((data) => data.name),
  };

  // 数字送信
  broadcast(admins, JSON.stringify(msgObj));
  broadcast(clients, JSON.stringify(msgObj));
};
