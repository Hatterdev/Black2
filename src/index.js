import React from "react";
import ReactDOM from "react-dom/client"; // Importado da nova API de React 18
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";

// Função para configurar a biblioteca Web3 com ethers.js
function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 60000; // Configura o intervalo de polling (60 segundos)
  return library;
}

// Criação da raiz (root) usando ReactDOM.createRoot (React 18+)
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderização do app com Web3ReactProvider e StrictMode
root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
    </Web3ReactProvider>
  </React.StrictMode>
);

// Função para medir métricas de desempenho
reportWebVitals();