import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

export default function useUserConfig() {
  const [userConfig, setUserConfig] = useState({
    isBoard: false,
    maxNights: 3,
    username: ""
  });

  useEffect(() => {
    const fetchUserConfig = async () => {
      const data = (await axios.get(`${BASE_URL}/api/current-user/`)).data;
      setUserConfig({
        isBoard: data.isCabinBoard,
        maxNights: 3,
        username: data.username
      });
    };
    fetchUserConfig();
  }, []);
  return userConfig;
}
