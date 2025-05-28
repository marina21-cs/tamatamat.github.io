import { create } from "zustand";

interface GameTimeState {
  gameTime: number; // Game time in minutes since start
  isNight: boolean;
  cycleSpeed: number; // Minutes per real second
  
  startTime: () => void;
  toggleDayNight: () => void;
  updateTime: () => void;
}

export const useGameTime = create<GameTimeState>((set, get) => ({
  gameTime: 0,
  isNight: false,
  cycleSpeed: 1, // 1 game minute per real second
  
  startTime: () => {
    // Start the time cycle
    const interval = setInterval(() => {
      get().updateTime();
    }, 1000); // Update every second
    
    // Store interval for cleanup
    (window as any).gameTimeInterval = interval;
  },
  
  toggleDayNight: () => {
    set((state) => ({ isNight: !state.isNight }));
  },
  
  updateTime: () => {
    set((state) => {
      const newTime = state.gameTime + state.cycleSpeed;
      
      // Day/night cycle: 24 game minutes = 1 cycle
      // Night is from minute 18-24 and 0-6
      const cyclePosition = newTime % 24;
      const isNight = cyclePosition >= 18 || cyclePosition < 6;
      
      return {
        gameTime: newTime,
        isNight
      };
    });
  }
}));
