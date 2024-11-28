import { useRef } from 'react';


export function useRequestAbort() {
    const abortControllerRef = useRef(new AbortController());

    // useEffect(() => {
    //     const controller = abortControllerRef.current;
    //     return () => {
    //         controller.abort();
    //     };
    // }, []);

    return {
        signal: abortControllerRef.current.signal
    };
}
