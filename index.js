//theme-toggle
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const heading = document.querySelector("h2");
    const navi =document.querySelector("nav");

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");
        heading.classList.toggle("dark-mode");
        navi.classList.toggle("dark-mode");
    });


//interact
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseAbi,
} from "https://esm.sh/viem@1.21.4"

const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/FrrRJ_WZfDz67rI1DaYfd";
const CONTRACT_ADDRESS = "0x6e1219c3938Ee9de9df567616d1FC5D3b3966e13";
const ABI = parseAbi([
  "function set(uint256 _num)",
  "function get() view returns (uint256)",
]);

const sepoliaChain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [RPC_URL] },
  },
};

const connectButton = document.getElementById("connectButton");
const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const output = document.getElementById("output");

let walletClient;
let publicClient;
let account;
let isConnecting = false;

async function connectWallet() {
  if (isConnecting) return;
  isConnecting = true;

  try {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

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

    connectButton.innerText = "Wallet Connected";
    connectButton.disabled = true;

    alert("Wallet connected: " + account);
  } catch (err) {
    console.error("CONNECT ERROR:", err);
  } finally {
    isConnecting = false;
  }
}

async function setValue() {
  try {
    if (!walletClient || !account) {
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
  } catch (err) {
    console.error("SET ERROR:", err);
    alert("Transaction failed. Check console.");
  }
}

async function getValue() {
  try {
    if (!publicClient) {
      alert("Connect wallet first");
      return;
    }

    const value = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "get",
    });

    output.innerText = value.toString();
  } catch (err) {
    console.error("GET ERROR:", err);
    alert("Read failed. Check console.");
  }
}

connectButton.onclick = connectWallet;
setButton.onclick = setValue;
getButton.onclick = getValue;
