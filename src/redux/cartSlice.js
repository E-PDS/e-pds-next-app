import { createSlice } from '@reduxjs/toolkit';

// Helper to load from localStorage safely
const loadStateFromStorage = () => {
  const defaultState = { activeTabId: 1, tabs: [{ id: 1, label: 'Bill 1', items: [], customer: null, paymentMode: 'split', splitPayment: [{ method: 'cash', amount: 0 }] }] };

  if (typeof window === 'undefined') return defaultState;

  try {
    const saved = localStorage.getItem('checkoutCart');
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);

    // Check if it matches new structure
    if (parsed.tabs && Array.isArray(parsed.tabs) && parsed.activeTabId) {
      return parsed;
    }

    return defaultState;
  } catch (e) {
    console.error("Failed to load cart from local storage", e);
    return defaultState;
  }
};

const saveStateToStorage = (state) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('checkoutCart', JSON.stringify(state));
  }
};

const initialState = loadStateFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addTab: (state) => {
      const newId = Date.now();
      const newLabel = `Bill ${state.tabs.length + 1}`;
      state.tabs.push({ id: newId, label: newLabel, items: [], customer: null, paymentMode: 'split', splitPayment: [{ method: 'cash', amount: 0 }] });
      state.activeTabId = newId;
      saveStateToStorage(state);
    },
    removeTab: (state, action) => {
      const tabId = action.payload;

      const tabIndex = state.tabs.findIndex(t => t.id === tabId);
      state.tabs = state.tabs.filter(t => t.id !== tabId);

      // If all tabs are removed, create a new default tab
      if (state.tabs.length === 0) {
        const newId = Date.now();
        state.tabs = [{
          id: newId,
          label: 'Bill 1',
          items: [],
          customer: null,
          paymentMode: 'split',
          splitPayment: [{ method: 'cash', amount: 0 }]
        }];
        state.activeTabId = newId;
      }
      // If we removed the active tab, switch to another one
      else if (state.activeTabId === tabId) {
        // Try to go to the left, otherwise go to the right (which is now at the same index)
        const newIndex = Math.max(0, tabIndex - 1);
        state.activeTabId = state.tabs[newIndex].id;
      }
      saveStateToStorage(state);
    },
    setActiveTab: (state, action) => {
      state.activeTabId = action.payload;
      saveStateToStorage(state);
    },
    renameTab: (state, action) => {
      const { id, label } = action.payload;
      const tab = state.tabs.find(t => t.id === id);
      if (tab) {
        tab.label = label;
        saveStateToStorage(state);
      }
    },
    setCustomer: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.customer = action.payload;
        saveStateToStorage(state);
      }
    },
    removeCustomer: (state) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.customer = null;
        saveStateToStorage(state);
      }
    },
    setPaymentMode: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.paymentMode = action.payload;
        saveStateToStorage(state);
      }
    },
    setSplitPayment: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.splitPayment = action.payload;
        saveStateToStorage(state);
      }
    },

    // Cart Item Operations (Act on Active Tab)
    setCart: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.items = action.payload;
        saveStateToStorage(state);
      }
    },
    addItem: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.items.push(action.payload);
        saveStateToStorage(state);
      }
    },
    removeItem: (state, action) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.items = activeTab.items.filter(item => item.id !== action.payload);
        saveStateToStorage(state);
      }
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity, total } = action.payload;
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        const item = activeTab.items.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
          item.total = total;
          saveStateToStorage(state);
        }
      }
    },
    updateItemUnit: (state, action) => {
      const { id, unit, total } = action.payload;
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        const item = activeTab.items.find(item => item.id === id);
        if (item) {
          item.selectedUnit = unit;
          item.total = total;
          saveStateToStorage(state);
        }
      }
    },
    clearCart: (state) => {
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        activeTab.items = [];
        activeTab.customer = null;
        activeTab.splitPayment = [{ method: 'cash', amount: 0 }];
        saveStateToStorage(state);
      }
    },
  },
});

export const {
  addTab,
  removeTab,
  setActiveTab,
  renameTab,
  setCustomer,
  removeCustomer,
  setPaymentMode,
  setSplitPayment,
  setCart,
  addItem,
  removeItem,
  updateItemQuantity,
  updateItemUnit,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
