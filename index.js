import {
  createWalletClient,
  createPublicClient,
  custom,
  http,
  parseAbi,
} from "https://esm.sh/viem@1.21.4";

// HTML elements
const connectButton = document.getElementById("connectButton");
const setButton = document.getElementById("setButton");
const getButton = document.getElementById("getButton");
const output = document.getElementById("output");

// Contract
const CONTRACT_ADDRESS = "0x6e1219c3938Ee9de9df567616d1FC5D3b3966e13";

const ABI = parseAbi([
  "function set(uint256 _num)",
  "function get() view returns (uint256)",
]);

// Sepolia chain (MUST be explicit)
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

// ---------------- CONNECT WALLET ----------------
async function connectWallet() {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    // Force Sepolia
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // 11155111
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
      transport: http("https://eth-sepolia.public.blastapi.io"),
    });

    alert("Wallet connected: " + account);
  } catch (err) {
    console.error("CONNECT ERROR:", err);
    alert("Connect failed. Check console.");
  }
}

// ---------------- SET VALUE ----------------
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

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: "set",
      args: [BigInt(value)],
      account,
    });

    console.log("TX HASH:", hash);
    alert("Transaction sent. Check MetaMask.");
  } catch (err) {
    console.error("SET ERROR:", err);
    alert("Set failed. Check console.");
  }
}

// ---------------- GET VALUE ----------------
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
    alert("Get failed. Check console.");
  }
}

// Button bindings
connectButton.onclick = connectWallet;
setButton.onclick = setValue;
getButton.onclick = getValue;
