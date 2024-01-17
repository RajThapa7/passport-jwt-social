const cors = require("cors");
const origin1 = process.env.CLIENT_URL1;

const corsOptions = {
  origin: origin1,
  optionsSuccessStatus: 200,
};

const corsMiddleware = () => {
  if (!origin1) {
    throw new Error("CLIENT_URL not defined");
  }
  return cors(corsOptions);
};

module.exports = corsMiddleware;
