import { create } from "zustand";

export const useWinnersStore = create(
    (set) => ({
        state: '',
    })
);