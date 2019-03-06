import { useState, useEffect } from "react";
import { fetchAPIData } from "../api";

const useUserConfig = () => {
  const [userConfig, setUserConfig] = useState({
    isBoard: false,
    maxNights: 3,
    username: ""
  });

  const fetchUserConfig = async () => {
    const data = await fetchAPIData("/api/current-user/");
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
