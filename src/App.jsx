import { useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import Decimal from "decimal.js";

function App() {
  const [hash, setHash] = useState("");
  const [transaction, setTransaction] = useState(["", "", "", "", "", ""]);

  const checkTransaction = () => {
    console.log(process.env);
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_RPC));
    web3.eth.getTransaction(hash, (err, txn) => {
      const sender = txn["from"];
      const receiver = txn["to"];
      var volume = Decimal(txn["value"]) / 10 ** 18;
      setTransaction(["Ethereum", sender, receiver, volume, "Ether", "eth"]);
    });
  };

  return (
    <>
      <div className="transactionInput">
        <input
          type="text"
          placeholder="0x..."
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
          }}
        />
        <button onClick={checkTransaction}>送信</button>
      </div>
      <h1>トランザクション確認</h1>
      <ul>
        <li>chain: {transaction[0]}</li>
        <li>送信元アドレス: {transaction[1]}</li>
        <li>送信先アドレス: {transaction[2]}</li>
        <li>送信額: {transaction[3]}</li>
        <li>トークン名: {transaction[4]}</li>
        <li>トークンシンボル: {transaction[5]}</li>
      </ul>
    </>
  );
}

export default App;
