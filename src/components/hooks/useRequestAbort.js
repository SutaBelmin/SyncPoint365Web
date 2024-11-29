import { useRef } from 'react';


export function useRequestAbort() {
    const abortControllerRef = useRef(new AbortController());

    return {
        signal: abortControllerRef.current.signal
    };
}
