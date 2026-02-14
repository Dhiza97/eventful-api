import axios from "axios";

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export const fetchEventImage = async (query: string): Promise<string> => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        per_page: 1,
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    if (results.length > 0) {
      return results[0].urls.regular; // Use regular size
    }

    // Fallback image if none found
    return "https://source.unsplash.com/800x600/?event";
  } catch (err) {
    console.error("Unsplash API error:", err);
    return "https://source.unsplash.com/800x600/?event";
  }
};