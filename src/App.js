import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Troque Switch por Routes para a versão 6+
import MainLayout from "./layouts/main";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/home/Home";
import PreSale from "./pages/launchpadApply/Presale";
import PrivateSale from "./pages/launchpadApply/PrivateSale";
import DetailsComp from "./pages/launchpadApply/presaleview/DetailsComp";
import DetailsCompPrivatesale from "./pages/launchpadApply/privatesaleview/DetailsCompPrivatesale";
import ProjectList from "./pages/launchpadApply/SaleList/ProjectList";
import PrvProjectList from "./pages/launchpadApply/PrvSaleList/PrvProjectList";
import PrvContributions from "./pages/launchpadApply/PrvSaleList/component/PrvContributions";
import MyContributions from "./pages/launchpadApply/SaleList/component/MyContributions";
import Fairsale from "./pages/launchpadApply/Fairsale";
import DetailsFairComp from "./pages/launchpadApply/fairsaleview/DetailsFairComp";
import MainLock from "./pages/lock/MainLock";
import MainToken from "./pages/token/MainToken";
import TokenDetails from "./pages/token/TokenDetails";
import TokenLockList from "./pages/locklist/TokenLockList";
import LockView from "./pages/locklist/LockView";
import LockRecord from "./pages/locklist/LockRecord";
import MyTokenLock from "./pages/locklist/MyTokenLock";
import MyLpLock from "./pages/locklist/MyLpLock";
import KycAudit from "./component/KycAudit";
import LpLockList from "./pages/locklist/LpLockList";

const globalChainID = 56; // Certifique-se de que este seja o Chain ID da Binance Smart Chain (56 é para mainnet)

// Aplicação principal
function App() {
  return (
    <div className="App">
      <Router>
        <ToastContainer pauseOnFocusLoss={false} />
        <MainLayout>
          <Routes> {/* Routes substitui Switch no React Router v6 */}
            <Route path="/" element={<Home />} />
            <Route path="/presale-details" element={<DetailsComp />} />
            <Route path="/private-details" element={<DetailsCompPrivatesale />} />
            <Route path="/fairlaunch-details" element={<DetailsFairComp />} />
            <Route path="/presale" element={<PreSale />} />
            <Route path="/privatesale" element={<PrivateSale />} />
            <Route path="/fairlaunch" element={<Fairsale />} />
            <Route path="/sale-list" element={<ProjectList />} />
            <Route path="/prvsale-list" element={<PrvProjectList />} />
            <Route path="/my-contribution" element={<MyContributions />} />
            <Route path="/prv-contribution" element={<PrvContributions />} />
            <Route path="/lock" element={<MainLock />} />
            <Route path="/token" element={<MainToken />} />
            <Route path="/token-details" element={<TokenDetails />} />
            <Route path="/token-locked" element={<TokenLockList />} />
            <Route path="/liquidity-locked" element={<LpLockList />} />
            <Route path="/lock-details/:id" element={<LockView />} />
            <Route path="/lock-record/:id" element={<LockRecord />} />
            <Route path="/my-token-lock" element={<MyTokenLock />} />
            <Route path="/my-lp-lock" element={<MyLpLock />} />
            <Route path="/kycaudit" element={<KycAudit />} />
          </Routes>
        </MainLayout>
      </Router>
    </div>
  );
}

export default App;