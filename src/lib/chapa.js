import axios from "axios";

const chapaInstance = axios.create({
  baseURL: "https://api.chapa.co/v1",
  headers: {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export const initializePayment = async ({
  amount,
  currency = "ETB",
  email,
  first_name,
  last_name,
  tx_ref,
  callback_url,
  return_url,
  customization = {},
}) => {
  const payload = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    tx_ref,
    callback_url,
    return_url,
    customization,
  };

  try {
    const response = await chapaInstance.post("/transaction/initialize", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code outside of the 2xx range
      console.error("Chapa API Error:", error.response.data);
      throw new Error(`Chapa API Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("No response received from Chapa API:", error.request);
      throw new Error("No response received from Chapa API.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error in setting up Chapa API request:", error.message);
      throw new Error(`Error in setting up Chapa API request: ${error.message}`);
    }
  }
};

export const verifyPayment = async (tx_ref) => {
  try {
    const response = await chapaInstance.get(`/transaction/verify/${tx_ref}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Chapa API Error:", error.response.data);
      throw new Error(`Chapa API Error: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error("No response received from Chapa API:", error.request);
      throw new Error("No response received from Chapa API.");
    } else {
      console.error("Error in setting up Chapa API request:", error.message);
      throw new Error(`Error in setting up Chapa API request: ${error.message}`);
    }
  }
};
