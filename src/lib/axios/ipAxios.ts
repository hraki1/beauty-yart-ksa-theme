import axios from "axios";

// Utility to fetch and cache the client IP
let cachedIp: string = "";
async function getClientIp(): Promise<string> {
  if (cachedIp) return cachedIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedIp = data.ip;
    return cachedIp;
  } catch {
    return "unknown";
  }
}

const ipAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

ipAxios.interceptors.request.use(async (config) => {
  const ip = await getClientIp();
  config.headers = config.headers || {};
  config.headers["x-client-ip"] = ip;
  return config;
});

export default ipAxios;
