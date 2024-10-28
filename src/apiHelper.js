import axios from "axios";

export const fetchData = async (apiEndpoint, fallbackData) => {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error("API call failed. Falling back to default data.", error);
    return fallbackData;
  }
};
