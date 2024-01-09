import { useReducer, useEffect } from 'react';

const useLocalStorage = (key, reducer, initialState) => {
    // Get initial state from local storage or set to initialState
    const init = () => {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
            return JSON.parse(stored);
        }
        return initialState;
    };

    // Use useReducer hook with the reducer and initialized state
    const [state, dispatch] = useReducer(reducer, initialState, init);

    // Update local storage when state changes
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);

    return [state, dispatch];
};

export default useLocalStorage;