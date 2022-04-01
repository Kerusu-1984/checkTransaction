import { atom } from "recoil";

export const selectedNetworkName = atom({
  key: "selectedNetworkName",
  default: "Ethereum",
});
