import React, { useContext, useState } from 'react';
import { formatPrice } from '../../../hooks/contractHelper';
import Context from "./context/Context";
import { useCommonStats } from './hooks/useStats';
import { useWeb3React } from "@web3-react/core";
import { supportNetwork } from '../../../hooks/network';
import kycImg from '../../../images/kyc.png';
import auditImg from '../../../images/secure.png';

export default function Step4() {
  const { value, btnNextStep, btnPrevStep, setValue } = useContext(Context);
  const { chainId } = useWeb3React();
  const [updater] = useState(new Date());
  const commonStats = useCommonStats(updater);

  const updateCost = (key, isChecked) => {
    const price = key === 'audit' ? commonStats.auditPrice : commonStats.kycPrice;
    const totalCost = isChecked ?
      Math.round((parseFloat(value.totalCost) + parseFloat(price)) * 1e12) / 1e12 :
      Math.round((parseFloat(value.totalCost) - parseFloat(price)) * 1e12) / 1e12;

    setValue({ ...value, [key]: isChecked, totalCost });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    updateCost(name, checked);
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const isKycOrAuditSelected = value.kyc || value.audit;

  return (
    <div className={`tab-pane ${value.step === 4 ? 'active' : ''}`} role="tabpanel" id="step4">
            <h4 className="text-center">Choose your marketing, KYC, and auditing option below</h4>
            <div className="container">
                <h5 className='text-center'>Audit & KYC Service</h5>
                <div className="row">
                    <div className="col text-center">
                        <label htmlFor="audit">AUDIT</label><br />
                        <img src={auditImg} alt="secure" className='mb-3' height="50px" width="50px" /><br />
                        <span>{formatPrice(commonStats.auditPrice || 0)}</span><br />
                        <div className="container">
                            <label className="switch" htmlFor="audit">
                                <input type="checkbox" name="audit" id="audit" onChange={handleCheckboxChange} checked={value.audit} />
                                <div className="slider round"></div>
                            </label>
                        </div>
                    </div>
                    <div className="col text-center">
                        <label htmlFor="kyc">KYC</label><br />
                        <img src={kycImg} alt="kyc" className='mb-3' height="50px" width="50px" /><br />
                        <span>{formatPrice(commonStats.kycPrice || 0)}</span><br />
                        <div className="container">
                            <label className="switch" htmlFor="kyc">
                                <input type="checkbox" name="kyc" id="kyc" onChange={handleCheckboxChange} checked={value.kyc} />
                                <div className="slider round"></div>
                            </label>
                        </div>
                    </div>
                </div>
                {isKycOrAuditSelected && (
                    <div className="row">
                        <div className="col-12 mt-4 mb-0">
                            <div className="form-group">
                                <label>Contact Email</label>
                                <input
                                    className="form-control"
                                    onChange={onChangeInput}
                                    value={value.usermail}
                                    type="text"
                                    name="usermail"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className='text-center mt-2'>Total Cost: {formatPrice(value.totalCost || 0)} {supportNetwork[chainId]?.symbol || supportNetwork['default'].symbol}</div>
            <ul className="list-inline text-center">
                <li>
                    <button type="button" className="btn default-btn prev-step mr-4" onClick={btnPrevStep}>Back</button>
                </li>
                <li>
                    <button type="button" className="btn default-btn next-step" onClick={btnNextStep}>Continue</button>
                </li>
            </ul>
        </div>
  );
}