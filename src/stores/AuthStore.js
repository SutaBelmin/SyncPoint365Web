import { create } from 'zustand';

export const AuthStore = create((set) => ({
  loggedUser: null,

  setLoggedUser: (user) => {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    set({ loggedUser: user });
  },

  clearLoggedUser: () => {
    localStorage.removeItem('loggedUser');
    set({ loggedUser: null });
  },

  initializeAuthStore: () => {
    const savedUser = localStorage.getItem('loggedUser');
    if (savedUser) {
      set({ loggedUser: JSON.parse(savedUser) });
    }
  },
}));
