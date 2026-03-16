import { createSlice } from '@reduxjs/toolkit';

const loadStateFromStorage = () => {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem('selectedStore');
        if (!saved) return null;
        return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to load store from local storage", e);
        return null;
    }
};

const saveStateToStorage = (state) => {
    if (typeof window !== 'undefined') {
        if (state) {
            localStorage.setItem('selectedStore', JSON.stringify(state));
        } else {
            localStorage.removeItem('selectedStore');
        }
    }
};

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        selectedStore: loadStateFromStorage(),
    },
    reducers: {
        setSelectedStore: (state, action) => {
            state.selectedStore = action.payload;
            saveStateToStorage(state.selectedStore);
        },
        clearSelectedStore: (state) => {
            state.selectedStore = null;
            saveStateToStorage(null);
        }
    }
});

export const { setSelectedStore, clearSelectedStore } = shopSlice.actions;

export default shopSlice.reducer;
