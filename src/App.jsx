import { useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import Decimal from "decimal.js";
import { ERC20abi } from "./abi";
import { useRecoilValue } from "recoil";
import { selectedNetworkName } from "./recoil/atoms";
import NetworkInput from "./components/NetworkInput";

function App() {
  const [hash, setHash] = useState("");
  const selectedNetwork = useRecoilValue(selectedNetworkName);
  const [transaction, setTransaction] = useState(["", "", "", "", "", ""]);
  const abi = ERC20abi;

  const switchRPC = () => {
    switch (selectedNetwork) {
      case "Ethereum": {
        return process.env.REACT_APP_ETH_RPC;
      }
      case "Polygon": {
        return "https://polygon-rpc.com";
      }
      case "Shiden": {
        return "https://rpc.shiden.astar.network:8545";
      }
      case "Gnosis": {
        return "https://rpc.gnosischain.com";
      }
      case "Avalanche": {
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
    setTransaction([
      selectedNetwork,
      sender,
      input.recipient,
      volume,
      name,
      symbol,
    ]);
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
        <NetworkInput network="Ethereum" />
        <NetworkInput network="Polygon" />
        <NetworkInput network="Shiden" />
        <NetworkInput network="Gnosis" />
        <NetworkInput network="Avalanche" />
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
