import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    
    const activeHttpRequests = useRef([]);

        const sendRequest = useCallback(
            async (url, method = 'GET', body = null, headers = {} ) => {
            setIsLoading(true);
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body,
                    headers,
                    signal: httpAbortCtrl.signal
                });

                const responseData = await response.json();
                
                // activeHttpRequests.current = activeHttpRequests.current.filter(
                //     reqCtrl => reqCtrl !== httpAbortCtrl
                // );

                if(!response.ok) {
                    throw new Error(responseData || 'Something went wrong');
                }

                setIsLoading(false);
                return responseData;
            } catch(err) {
                if (err.name === 'AbortError'){
                    setIsLoading(false);
                } else {
                    setError(err.message);
                    setIsLoading(false);
                    console.log(err);
                    throw err;
                }
                throw err;
            }
        }, []);
    

    const clearError = () => {
        setError(null);
    };

    // useEffect(() => {
    //     return () => {
    //       // eslint-disable-next-line react-hooks/exhaustive-deps
    //       activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
    //     };
    //   }, []);

    useEffect(() => {
        const abortAllRequests = () => {
          activeHttpRequests.current.forEach(controller => controller.abort());
        };
        return abortAllRequests;
      }, []);

    return { isLoading, error, sendRequest, clearError };
};
