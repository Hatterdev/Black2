import React, { useContext, useState } from "react";
import TokenInput from "../../../component/TokenInput";
import Context from "./context/Context";
import { getWeb3 } from "../../../hooks/connectors";
import { toast } from "react-toastify";
import { contract } from "../../../hooks/constant";
import { useWeb3React } from "@web3-react/core";
import { getContract } from "../../../hooks/contractHelper";
import tokenAbi from "../../../json/token.json";
import { parseEther } from "@ethersproject/units";
import Button from "react-bootstrap-button-loader";
import { currencies } from "../../../hooks/currencies";

export default function Step1() {
  const context = useWeb3React();
  const { chainId, account, library } = context;
  const { value, btnNextStep, setValue } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [symbol, setSymbol] = useState(value.currencyTSymbol);

  const currencyList = currencies[chainId] || currencies["default"];

  const firstStepSubmit = (e) => {
    e.preventDefault();
    const { tokenName, tokenDecimal, tokenSymbol } = value;
    if (tokenName && tokenDecimal && tokenSymbol) {
      btnNextStep(e);
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleCurrencyChange = (e) => {
    const selectedCurrency = currencyList.find(currency => currency.address === e.target.value);
    if (selectedCurrency) {
      setValue({
        ...value,
        currencyTSymbol: selectedCurrency.symbol,
        currencyAddress: selectedCurrency.address,
      });
      setSymbol(selectedCurrency.symbol);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    if (!account) {
      return toast.error("Please Connect Wallet!");
    }

    if (!chainId) {
      return toast.error("Please select Smart Chain Network !");
    }

    if (!value.tokenAddress) {
      return toast.error("Please enter a valid token address !");
    }

    setLoading(true);

    try {
      const poolfactoryAddress = contract[chainId]?.poolfactory || contract["default"].poolfactory;
      const tokenContract = getContract(tokenAbi, value.tokenAddress, library);
      const amount = parseEther("1000000000000000000000000000").toString();

      const tx = await tokenContract.approve(poolfactoryAddress, amount, { from: account });
      const resolveAfterDelay = new Promise((resolve) => setTimeout(resolve, 10000));
      toast.promise(resolveAfterDelay, { pending: "Waiting for confirmation 👌" });

      const checkTransaction = async () => {
        const web3 = getWeb3(chainId);
        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
        if (receipt) {
          clearInterval(interval);
          if (receipt.status) {
            toast.success("Success! Your last transaction was successful 👍");
            setValue({ ...value, isApprove: true });
          } else {
            toast.error("Error! Your last transaction failed.");
          }
        }
      };

      const interval = setInterval(checkTransaction, 5000);
    } catch (err) {
      toast.error(err.reason || "An error occurred while processing the transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`tab-pane ${value.step === 1 ? "active" : ""}`} role="tabpanel" id="step1">
      <h4 className="text-center">Enter the token address and verify</h4>
      <div className="row">
        <TokenInput value={value} setValue={setValue} />
        <div className="col-md-12 mt-4 mb-0">
          <label>Currency</label>
          {currencyList.map((currency) => (
            <div className="form-check" key={currency.address}>
              <input
                type="radio"
                className="form-check-input"
                name="currency"
                value={currency.address}
                onChange={handleCurrencyChange}
                checked={value.currencyAddress === currency.address}
              />
              {currency.symbol}
            </div>
          ))}
        </div>
      </div>

      <ul className="list-inline text-center">
        {value.ispoolExist ? (
          <li>This pool already exists.</li>
        ) : value.isApprove ? (
          <li>
            <button
              type="button"
              className="btn default-btn next-step"
              onClick={firstStepSubmit}
            >
              Continue to next step
            </button>
          </li>
        ) : (
          <li>
            <Button
              type="button"
              variant="none"
              className="btn default-btn next-step"
              onClick={handleApprove}
              loading={loading}
            >
              Approve
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
}