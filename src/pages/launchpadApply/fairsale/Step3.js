import React, { useContext, useState } from "react";
import Context from "./context/Context";
import { toast } from "react-toastify";

export default function Step3() {
  const { value, btnNextStep, btnPrevStep, setValue } = useContext(Context);
  const [error, setError] = useState({
    logourl: "",
    bannerurl: "",
    website: "",
    facebook: "",
    twitter: "",
    github: "",
    telegram: "",
    instagram: "",
    discord: "",
    reddit: "",
    youtube: "",
    brief: "",
    blockstart: "",
  });

  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  const validateInput = (input, inputValue) => {
    let message = "";
    if (!urlRegex.test(inputValue) && inputValue !== "") {
      message = "Please Enter a Valid URL!";
    }
    setError((prev) => ({ ...prev, [input]: message }));
    return message === "";
  };

  const validateAllInputs = () => {
    return Object.keys(value).every((key) => validateInput(key, value[key]));
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
    validateInput(name, value);
  };

  const btnNextStepValidation = () => {
    if (validateAllInputs()) {
      btnNextStep();
    } else {
      toast.error("Required all fields! Please check again.");
    }
  };

  return (
    <div className={`tab-pane ${value.step === 3 ? "active" : ""}`} role="tabpanel" id="step3">
      <h4 className="text-center">Let people know who you are</h4>
      <div className="row">
        {["logourl", "bannerurl", "website", "facebook", "twitter", "github", "telegram", "instagram", "discord", "reddit", "youtube"].map((field, index) => (
          <div className="col-md-6 mt-4 mb-0" key={index}>
            <div className="form-group">
              <label>
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/url/, ' URL')}
                {["logourl", "bannerurl", "website"].includes(field) && <span className="text-danger">*</span>}
              </label>
              <input
                className="form-control"
                onChange={onChangeInput}
                type="text"
                name={field}
                placeholder={`e.g. https://example.com`}
              />
              <small className="text-danger">{error[field]}</small>
              <br />
            </div>
          </div>
        ))}
        <div className="col-md-12 mt-4 mb-0">
          <div className="form-group">
            <label>Description</label>
            <textarea
              type="text"
              name="brief"
              onChange={onChangeInput}
              className="brief"
              placeholder="Describe your project"
              value={value.brief}
            />
            <small className="text-danger">{error.brief}</small>
            <br />
          </div>
        </div>
      </div>
      <ul className="list-inline text-center">
        <li>
          <button type="button" className="btn default-btn prev-step mr-4" onClick={btnPrevStep}>
            Back
          </button>
        </li>
        <li>
          <button type="button" className="btn default-btn next-step" onClick={btnNextStepValidation}>
            Continue
          </button>
        </li>
      </ul>
    </div>
  );
}