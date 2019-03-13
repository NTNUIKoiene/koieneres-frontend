import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const useUserConfig = () => {
  const [userConfig, setUserConfig] = useState({
    isBoard: false,
    maxNights: 3,
    username: ""
  });

  const fetchUserConfig = async () => {
    const data = (await axios.get(`${BASE_URL}/api/current-user/`)).data;
    setUserConfig({
      isBoard: data.isCabinBoard,
      maxNights: 3,
      username: data.username
    });
  };

  useEffect(() => {
    fetchUserConfig();
  }, []);
  return userConfig;
};

export { useUserConfig };
