const fetchTokenLockData = async () => {
  try {
    const data = await mc.aggregate([
      pmc.methods.allNormalTokenLockedCount(),
    ]);

    const totalTokens = data[0];
    const currentPageSize = pageSize || 10; // Defina um valor padrão para pageSize
    let start = Math.max(totalTokens - 1 - page * currentPageSize, 0);
    let end = Math.min(start + currentPageSize - 1, totalTokens - 1);

    if (totalTokens > 0) {
      const lockdata = await mc.aggregate([
        pmc.methods.getCumulativeNormalTokenLockInfo(start, end),
      ]);

      const tokenDataPromises = lockdata[0].map(async (value) => {
        try {
          const tc = new web3.eth.Contract(tokenAbi, value.token);
          const tokendata = await mc.aggregate([
            tc.methods.name(),
            tc.methods.symbol(),
            tc.methods.decimals(),
          ]);
          return {
            amount: value.amount,
            decimals: tokendata[2],
            token: value.token,
            factory: value.factory,
            name: tokendata[0],
            symbol: tokendata[1],
          };
        } catch (tokenError) {
          console.error("Token fetch error: ", tokenError);
          return null; // Retorna null em caso de erro
        }
      });

      const results = await Promise.all(tokenDataPromises);
      const filteredResults = results.filter(Boolean); // Remove null entries

      setStats({
        allNormalTokenLockedCount: totalTokens,
        tokenList: filteredResults,
        page: page,
        pageSize: currentPageSize,
        loading: false,
      });
    } else {
      setStats({
        allNormalTokenLockedCount: totalTokens,
        tokenList: [],
        page: page,
        pageSize: currentPageSize,
        loading: false,
      });
    }
  } catch (err) {
    console.error("Fetch error: ", err);
    toast.error(err.reason || "An error occurred");
    history.push("/");
  }
};