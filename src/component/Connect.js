import React, { useEffect, useState } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { NoEthereumProviderError } from "@web3-react/injected-connector";
import { injected, walletconnect, coinbaseWallet } from "../hooks/connectors";
import Modal from "react-bootstrap/Modal";
import { trimAddress } from "../hooks/constant";
import { supportNetwork } from "../hooks/network";
import useEagerConnect from "../hooks/useWeb3";

const Connect = () => {
  const context = useWeb3React();
  const { connector, account, activate, deactivate, chainId, active, error } = context;
  const [show, setShow] = useState(false);
  const [networkshow, setNetworkshow] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState();

  useEagerConnect();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const getErrorMessage = (error) => {
    if (error instanceof NoEthereumProviderError) {
      return "Metamask not detected";
    }
    if (error instanceof UnsupportedChainIdError) {
      return (
        <span
          className="btn-text"
          onClick={() => switchNetwork(supportNetwork["default"].chainId)}
        >
          <img
            src={require("../images/heartbeat.png").default}
            alt="wrong-network"
            height="17px"
            width="17px"
            className="mx-2"
          />
          Wrong Network
        </span>
      );
    }
    deactivate(injected);
  };

  const activating = (connection) => connection === activatingConnector;
  const connected = (connection) => connection === connector;

  const switchNetwork = async (networkId) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });
    } catch (error) {
      console.error(error);
      if (error.code === 4902) {
        // Handle the case where the network is not added
        alert("This network is not added to your wallet. Please add it manually.");
      }
    }
  };

  return (
    <React.Fragment>
      <div className="d-flex justify-content-between align-items-center">
        <div
          style={{ cursor: "pointer" }}
          className="badge badge-outline"
          onClick={() => setNetworkshow(!networkshow)}
        >
          <img
            src={supportNetwork[chainId]?.image || ""}
            alt=""
            className="mx-2"
            width="20"
          />
          <span className="hide-on-mobile">
            {chainId && supportNetwork[chainId]?.name}
          </span>
        </div>
        <div className="d-flex">
          {error && (
            <button
              type="button"
              className="btn"
              onClick={() => setActivatingConnector(undefined)}
            >
              {getErrorMessage(error)}
            </button>
          )}
          {!error && (
            <>
              {active && (connected(injected) || connected(walletconnect) || connected(coinbaseWallet)) ? (
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    deactivate(injected);
                    deactivate(walletconnect);
                    deactivate(coinbaseWallet);
                  }}
                >
                  {account && trimAddress(account)}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShow(!show)}
                >
                  {activating(injected) || activating(walletconnect) || activating(coinbaseWallet) ? (
                    <span className="btn-text">Connecting...</span>
                  ) : (
                    <span className="btn-text">Connect</span>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for Wallet Connection */}
      <Modal show={show} onHide={() => setShow(false)} size="ms">
        <Modal.Header closeButton>
          <Modal.Title>Connect to a wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {[injected, walletconnect, coinbaseWallet].map((connectorType, index) => (
                <div className="col-12" key={index}>
                  <button
                    className="btn btn-dark modal-btn-connect"
                    onClick={() => {
                      activate(connectorType);
                      setShow(false);
                    }}
                  >
                    <div className="div-modal-btn">
                      <img
                        src={require(`../images/${connectorType.name}.svg`).default}
                        alt={connectorType.name}
                        className="modal-img"
                      />
                      <div className="text-modal-line">{connectorType.name}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for Network Selection */}
      <Modal show={networkshow} onHide={() => setNetworkshow(false)} size="ms">
        <Modal.Header closeButton>
          <Modal.Title>Select a Network</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {Object.keys(supportNetwork).map((key) => {
                if (key === "default") return null;
                return (
                  <div className="col-12" key={key}>
                    <button
                      className="btn btn-dark modal-btn-connect"
                      onClick={() => {
                        switchNetwork(supportNetwork[key].chainId);
                        setNetworkshow(false);
                      }}
                    >
                      <div className="div-modal-btn">
                        <img
                          src={supportNetwork[key].image}
                          alt={supportNetwork[key].name}
                          className="modal-img"
                        />
                        <div className="text-modal-line">
                          {supportNetwork[key].name}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Connect;