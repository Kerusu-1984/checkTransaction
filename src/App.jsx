import { useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import Decimal from "decimal.js";
import { ERC20abi } from "./abi";

function App() {
  const [hash, setHash] = useState("");
  const [chain, setChain] = useState("eth");
  const [transaction, setTransaction] = useState(["", "", "", "", "", ""]);
  const abi = ERC20abi;

  const switchRPC = () => {
    switch (chain) {
      case "eth": {
        return process.env.ETH_RPC;
      }
      case "polygon": {
        return "https://polygon-rpc.com";
      }
      case "shiden": {
        return "https://rpc.shiden.astar.network:8545";
      }
      case "gnosis": {
        return "https://rpc.gnosischain.com";
      }
      case "avalanche": {
        return "https://api.avax.network/ext/bc/C/rpc";
      }
    }
  };

  const checkTransaction = async () => {
    const rpc = switchRPC();
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const txn = await web3.eth.getTransaction(hash);
    const sender = txn["from"];
    const receiver = txn["to"];
    const token = new web3.eth.Contract(abi, receiver);
    const input = web3.eth.abi.decodeParameters(
      [
        { name: "recipient", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      "0x" + txn.input.slice(10)
    );
    const decimals = await token.methods.decimals().call();
    var volume = Decimal(input.amount) / 10 ** decimals;
    const name = await token.methods.name().call();
    const symbol = await token.methods.symbol().call();
    setTransaction([chain, sender, input.recipient, volume, name, symbol]);
  };

  return (
    <>
      <h1>ERC20送信のトランザクションハッシュを入力してください</h1>
      <div className="transactionInput">
        <input
          type="text"
          placeholder="0x..."
          value={hash}
          onChange={(e) => {
            setHash(e.target.value);
          }}
        />
        <label>
          <input
            type="radio"
            name="chain"
            value="eth"
            checked={chain === "eth"}
            onChange={(e) => setChain(e.target.value)}
          />
          Ethereum
        </label>
        <label>
          <input
            type="radio"
            name="chain"
            value="polygon"
            checked={chain === "polygon"}
            onChange={(e) => setChain(e.target.value)}
          />
          Polygon
        </label>
        <label>
          <input
            type="radio"
            name="chain"
            value="shiden"
            checked={chain === "shiden"}
            onChange={(e) => setChain(e.target.value)}
          />
          Shiden
        </label>
        <label>
          <input
            type="radio"
            name="chain"
            value="gnosis"
            checked={chain === "gnosis"}
            onChange={(e) => setChain(e.target.value)}
          />
          Gnosis
        </label>
        <label>
          <input
            type="radio"
            name="chain"
            value="avalanche"
            checked={chain === "avalanche"}
            onChange={(e) => setChain(e.target.value)}
          />
          Avalanche
        </label>
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
