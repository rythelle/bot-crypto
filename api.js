const axios = require("axios");
const querystring = require("query-string");

async function publicCall(path, data, method = "GET") {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : "";
    const result = await axios({
      method,
      url: `${process.env.API_URL}${path}${qs}`,
    });

    return result.data;
  } catch (error) {
    console.log(error);
  }
}

async function time() {
  return await publicCall("/v3/time");
}

async function depth(symbol = "BTCBRL", limit = 5) {
  return await publicCall("/v3/depth", { symbol, limit });
}

module.exports = { time, depth };
