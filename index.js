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

const ABI = parseAbi([
  "function set(uint256 _num)",
  "function get() view returns (uint256)",
]);

let walletClient;
let publicClient;
let account;

async function connectWallet() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  account = accounts[0];

  walletClient = createWalletClient({
    account,
    transport: custom(window.ethereum),
  });

  publicClient = createPublicClient({
    chain: {
      id: 11155111,
      name: "Sepolia",
      nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://eth-sepolia.public.blastapi.io"],
        },
      },
    },
    transport: http("https://eth-sepolia.public.blastapi.io"),
  });

  alert("Wallet connected");
}

async function setValue() {
  if (!walletClient) {
    alert("Connect wallet first");
    return;
  }

  const value = document.getElementById("numberInput").value;
  if (value === "") {
    alert("Enter a number");
    return;
  }

  await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "set",
    args: [BigInt(value)], 
    account,
  });

  alert("Transaction sent. Confirm in MetaMask.");
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
