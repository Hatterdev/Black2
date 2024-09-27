import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MulticallContractWeb3 } from "../../../../hooks/useContracts";
import { getWeb3 } from "../../../../hooks/connectors";
import poolFactoryAbi from '../../../../json/poolfactory.json';
import { toast } from "react-toastify";
import { contract } from "../../../../hooks/constant";
import { useNavigate } from "react-router-dom";

export const useCommonStats = (updater) => {
  const { chainId } = useWeb3React();
  const navigate = useNavigate();
  const web3 = getWeb3(chainId);

  let poolFactoryAddress = contract[chainId] ?
    contract[chainId].poolfactory :
    contract['default']?.poolfactory || '0xYourDefaultPoolFactoryAddress';

  const [stats, setStats] = useState({
    poolPrice: 0,
    auditPrice: 0,
    kycPrice: 0
  });

  const mc = MulticallContractWeb3(chainId);
  let pmc = web3 && poolFactoryAddress ? new web3.eth.Contract(poolFactoryAbi, poolFactoryAddress) : null;

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      if (!pmc) return;

      try {
        const data = await mc.aggregate([
          pmc.methods.poolPrice(),
          pmc.methods.auditPrice(),
          pmc.methods.kycPrice(),
        ]);

        if (isMounted) {
          setStats({
            poolPrice: data[0] / Math.pow(10, 18),
            auditPrice: data[1] / Math.pow(10, 18),
            kycPrice: data[2] / Math.pow(10, 18)
          });
        }
      } catch (err) {
        toast.error(err.reason || "Erro ao buscar os dados");
        navigate('/presale-list');
      }
    };

    if (mc) {
      fetch();
    } else {
      setStats({
        poolPrice: 0,
        auditPrice: 0,
        kycPrice: 0
      });
    }

    return () => {
      isMounted = false;
    };
  }, [updater, chainId, mc, pmc, navigate]);

  return stats;
};