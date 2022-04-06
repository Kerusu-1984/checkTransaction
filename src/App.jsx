import { useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import Decimal from "decimal.js";
import { ERC20abi } from "./abi";
import { useRecoilValue } from "recoil";
import { selectedNetworkName } from "./recoil/atoms";
import NetworkInput from "./components/NetworkInput";
import { networkRPC } from "./config/network";
import { useInput } from "./hooks/useInput";

function App() {
  const isTransactionHash = (value) => /^0x[0-9A-Fa-f]{64}$/.test(value);
  const {
    value: hash,
    setValue: setHash,
    isValid: enteredHashIsValid,
    validateHandler: hashValidateHandler,
  } = useInput("", isTransactionHash);
  const selectedNetwork = useRecoilValue(selectedNetworkName);
  const [txnDetail, setTxnDetail] = useState(["", "", "", "", "", ""]);

  const checkTransaction = async () => {
    const abi = ERC20abi;
    const rpc = networkRPC[selectedNetwork];
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
    const txn = (await web3.eth.getTransaction(hash)) ?? null;
    if (txn === null) {
      setTxnDetail(["", "", "", "", "", ""]);
      return;
    }
    const sender = txn["from"];
    const receiver = txn["to"];
    const token = new web3.eth.Contract(abi, receiver);
    try {
      const input = web3.eth.abi.decodeParameters(
        [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
        ],
        "0x" + txn.input.slice(10)
      );
      const decimals = await token.methods.decimals().call();
      const volume = Decimal(input.amount) / 10 ** decimals;
      const name = await token.methods.name().call();
      const symbol = await token.methods.symbol().call();
      setTxnDetail([
        selectedNetwork,
        sender,
        input.recipient,
        volume,
        name,
        symbol,
      ]);
    } catch (e) {
      alert(
        "ERC20トークンを送信するトランザクションハッシュを入力してください！"
      );
      setTxnDetail(["", "", "", "", "", ""]);
    }
  };

  const onClickHandler = () => {
    if (hashValidateHandler() === false) {
      setTxnDetail(["", "", "", "", "", ""]);
      return;
    }
    checkTransaction();
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
        <button onClick={onClickHandler}>送信</button>
        {!enteredHashIsValid && <div>hashが正しくないよ</div>}
      </div>
      <h1>トランザクション確認</h1>
      <ul>
        <li>chain: {txnDetail[0]}</li>
        <li>送信元アドレス: {txnDetail[1]}</li>
        <li>送信先アドレス: {txnDetail[2]}</li>
        <li>送信額: {txnDetail[3]}</li>
        <li>トークン名: {txnDetail[4]}</li>
        <li>トークンシンボル: {txnDetail[5]}</li>
      </ul>
    </>
  );
}
export default App;
