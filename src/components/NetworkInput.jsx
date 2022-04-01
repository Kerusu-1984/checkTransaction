import { useRecoilState } from "recoil";
import { selectedNetworkName } from "../recoil/atoms";

const NetworkInput = ({ network }) => {
  const [selectedNetwork, setSelectedNetwork] =
    useRecoilState(selectedNetworkName);

  return (
    <label>
      <input
        type="radio"
        name="chain"
        value={network}
        checked={selectedNetwork === network}
        onChange={(e) => setSelectedNetwork(e.target.value)}
      />
      {network}
    </label>
  );
};

export default NetworkInput;
