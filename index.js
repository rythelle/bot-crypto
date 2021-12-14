const api = require("./api");

const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);
const coin = process.env.COIN;
const priceBuy = process.env.PRICE_BUY;
const priceSell = process.env.PRICE_SELL;

setInterval(async () => {
  let buy = 0;
  let sell = 0;

  const result = await api.depth(symbol);
  if (result.bids && result.bids.length) {
    console.log(`Highest Buy: ${result.bids[0][0]}`);
    buy = parseFloat(result.bids[0][0]);
  }
  if (result.asks && result.asks.length) {
    console.log(`Lowest Sell: ${result.asks[0][0]}`);
    sell = parseFloat(result.asks[0][0]);
    console.log(sell);
  }

  if (sell && sell < priceBuy) {
    console.log("Hora de comprar!");

    const account = await api.accountInfo();
    const coins = account.balances.filter(
      (b) => symbol.indexOf(b.asset) !== -1
    );
    console.log("Valores atuais na carteira:");
    console.log(coins);

    console.log("Verificando se possui fundos");
    const walletCoin = parseFloat(coins.find((c) => c.asset === coin).free);
    console.log(walletCoin);
    if (sell <= walletCoin) {
      console.log("Realizando a compra");

      const buyOrder = await api.newOrder(symbol, 1);

      console.log(`Order ID: ${buyOrder.orderId}`);
      console.log(`Status: ${buyOrder.status}`);

      if (buyOrder.status === "FILLED") {
        console.log("Posicionando venda futura...");
        const price = parseFloat(sell * profitability).toFixed(8);

        console.log(`Vendendo por: (${sell}) (${profitability})`);
        const sellOrder = await api.newOrder(symbol, 1, price, "SELL", "LIMIT");

        console.log(`Order ID: ${sellOrder.orderId}`);
        console.log(`Status: ${sellOrder.status}`);
      }
    }
  } else if (buy && buy > priceSell) {
    console.log("Hora de vender!");
  } else {
    console.log("Esperando...");
  }

  // console.log(await api.exchangeInfo());
}, process.env.CRAWLER_INTERVAL);
