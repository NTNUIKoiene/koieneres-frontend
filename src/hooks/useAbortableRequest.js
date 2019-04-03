import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

export default function useAbortableRequest(
  url,
  handleSuccess,
  handleError,
  method = "get"
) {
  const [effectCount, setEffectCount] = useState(0);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    const source = axios.CancelToken.source();
    let didCancel = false;

    const request = async () => {
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url: BASE_URL + url,
          data: {
            cancelToken: source.token
          }
        });
        if (!didCancel) {
          handleSuccess(response);
        }
      } catch (error) {
        if (!didCancel) {
          handleError(error);
        }
      }
      return didCancel;
    };
    request();
    return () => {
      didCancel = true;
      source.cancel();
      isMounted.current = false;
    };
  }, [effectCount]);

  return () => {
    if (isMounted.current) {
      setEffectCount(prevCount => prevCount + 1);
    }
  };
}
