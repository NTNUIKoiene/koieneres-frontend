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

const useAbortableRequest = (
  initalState,
  method,
  url,
  handleSuccess,
  handleError,
  deps = []
) => {
  // TODO: Support dependency array (deps)
  const [state, setState] = useState(initalState);
  const source = axios.CancelToken.source();
  let didCancel = false;

  useEffect(() => {
    const request = async () => {
      try {
        const response = await axios({
          method,
          url,
          data: {
            cancelToken: source.token
          }
        });
        setState(handleSuccess(response));
      } catch (error) {
        console.log(error);
        if (!didCancel) {
          handleError(error);
        }
      }
    };
    request();
    return () => {
      didCancel = true;
      source.cancel();
    };
  }, deps);

  return state;
};

export { useUserConfig, useAbortableRequest };
