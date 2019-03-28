import { useEffect } from "react";
import axios from "axios";

export default function useAbortableRequest(
  method,
  url,
  handleSuccess,
  handleError,
  deps = []
) {
  const source = axios.CancelToken.source();
  let didCancel = false;

  useEffect(() => {
    const request = async () => {
      try {
        const response = await axios({
          method: method.toLowerCase(),
          url,
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
    };
    request();
    return () => {
      didCancel = true;
      source.cancel();
    };
  }, deps);
}
