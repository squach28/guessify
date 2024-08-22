import axios from "axios";
import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      axios
        .get(url, { withCredentials: true })
        .then((res) => setData(res.data))
        .catch((e) => setError(e))
        .finally(setIsLoading(false));
    };
    fetchData();
  }, [url]);

  return { data, isLoading, error };
};
