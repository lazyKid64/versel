// ================= THEME TOGGLE =================
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;
const heading = document.querySelector("h2");
const navi = document.querySelector("nav");

themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  heading.classList.toggle("dark-mode");
  navi.classList.toggle("dark-mode");
  
});

// ================= WEB3 IMPORTS =================
import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseAbi,
} from "https://esm.sh/viem";

// ================= HTML ELEMENTS =================
const connectButton = document.getElementById("connectButton");
const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const output = document.getElementById("output");

// ================= SMART CONTRACT =================
const CONTRACT_ADDRESS = "0x6e1219c3938Ee9de9df567616d1FC5D3b3966e13";

const ABI = parseAbi([
  "function set(uint256 _num)",
  "function get() view returns (uint256)",
]);

// ================= SEPOLIA CONFIG =================
const sepoliaChain = {
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://eth-sepolia.public.blastapi.io"],
    },
  },
};

let walletClient;
let publicClient;
let account;

// ================= CONNECT WALLET =================
async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask is not installed");
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
    transport: http("https://eth-sepolia.public.blastapi.io"),
  });

  alert("Connected wallet: " + account);
}

// ================= SET VALUE =================
async function setValue() {
  const value = document.getElementById("numberInput").value;

  if (!value) {
    alert("Please enter a number");
    return;
  }

  await walletClient.writeContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "set",
    args: [value],
    account,
  });

  alert("Transaction sent to Sepolia");
}

// ================= GET VALUE =================
async function getValue() {
  const value = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: "get",
  });

  output.innerText = value.toString();
}

// ================= BUTTON EVENTS =================
connectButton.onclick = connectWallet;
setButton.onclick = setValue;
getButton.onclick = getValue;
