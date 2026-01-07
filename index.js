import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseAbi,
} from "https://esm.sh/viem@1.21.4";

const connectButton = document.getElementById("connectButton");
const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const output = document.getElementById("output");

const CONTRACT_ADDRESS = "0x6e1219c3938Ee9de9df567616d1FC5D3b3966e13";

const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/FrrRJ_WZfDz67rI1DaYfd";

const ABI = parseAbi([
  "function set(uint256 _num)",
  "function get() view returns (uint256)",
]);

const sepoliaChain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
};

let walletClient;
let publicClient;
let account;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0xaa36a7" }],
  });

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  account = accounts[0];

  walletClient = createWalletClient({
    account,
    chain: sepoliaChain,
    transport: custom(window.ethereum),
  });

  publicClient = createPublicClient({
    chain: sepoliaChain,
    transport: http(RPC_URL),
  });

  alert("Wallet connected");
}

async function setValue() {
  const value = document.getElementById("numberInput").value;

  await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "set",
    args: [BigInt(value)],
    account,
  });
}

async function getValue() {
  const value = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "get",
  });

  output.innerText = value.toString();
}

connectButton.onclick = connectWallet;
setButton.onclick = setValue;
getButton.onclick = getValue;
