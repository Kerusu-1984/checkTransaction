import { useRecoilState } from "recoil";
import { selectedNetworkName } from "../recoil/atoms";
import { networkRPC } from "../config/network";

const NetworkInputs = () => {
  const [selectedNetwork, setSelectedNetwork] =
    useRecoilState(selectedNetworkName);
  const networks = Object.keys(networkRPC);

  return networks.map((network) => (
    <label>
      <input
        type="radio"
        name="chain"
        value={network}
        checked={selectedNetwork === network}
        onChange={(e) => setSelectedNetwork(e.target.value)}
        key={network}
      />
      {network}
    </label>
  ));
};

export default NetworkInputs;
