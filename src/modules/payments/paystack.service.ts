import axios from "axios";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export const initializePayment = async (
  email: string,
  amount: number,
  reference: string
) => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100,
        reference,
        callback_url: `${process.env.FRONTEND_URL}/payment-success`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("PAYSTACK ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyPayment = async (reference: string) => {
  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data.data;
};