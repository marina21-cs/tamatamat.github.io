import { useCallback } from "react";
import { usePet } from "../lib/stores/usePet";
import { useAudio } from "../lib/stores/useAudio";

export function usePetCare() {
  const { pet, updatePet, setState } = usePet();
  const { playSuccess, playHit } = useAudio();

  const feedPet = useCallback(() => {
    if (pet.hunger > 90) return;
    
    setState('eating');
    playSuccess();
    
    // Feeding takes 30 seconds for full effect
    const feedingDuration = 30000; // 30 seconds
    const hungerGainPerSecond = 25 / 30; // Gain 25 hunger over 30 seconds
    
    updatePet({
      lastFed: Date.now(),
      lastInteraction: Date.now()
    });
    
    // Gradual hunger restoration every 5 seconds during eating
    const feedInterval = setInterval(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state !== 'eating') {
        clearInterval(feedInterval);
        return;
      }
      
      updatePet({
        hunger: Math.min(100, currentState.pet.hunger + (hungerGainPerSecond * 5)),
        happiness: Math.min(100, currentState.pet.happiness + 1),
        health: Math.min(100, currentState.pet.health + 0.5),
        // Energy cost for digestion
        energy: Math.max(0, currentState.pet.energy - 1)
      });
    }, 5000); // Every 5 seconds
    
    // Finish eating after 30 seconds
    setTimeout(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state === 'eating') {
        clearInterval(feedInterval);
        setState('idle');
        updatePet({
          hunger: Math.min(100, currentState.pet.hunger + 5), // Final hunger boost
          happiness: Math.min(100, currentState.pet.happiness + 3)
        });
      }
    }, feedingDuration);
  }, [pet.hunger, updatePet, setState, playSuccess]);

  const playWithPet = useCallback(() => {
    if (pet.energy < 20 || pet.happiness > 90) return;
    
    setState('playing');
    playSuccess();
    
    // Playing takes 1-2 minutes for full effect
    const playDuration = 90000; // 1.5 minutes
    const happinessGainPerSecond = 20 / 90; // Gain 20 happiness over 90 seconds
    
    updatePet({
      lastPlayed: Date.now(),
      lastInteraction: Date.now()
    });
    
    // Gradual happiness increase and energy/cleanliness decrease during play
    const playInterval = setInterval(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state !== 'playing') {
        clearInterval(playInterval);
        return;
      }
      
      updatePet({
        happiness: Math.min(100, currentState.pet.happiness + (happinessGainPerSecond * 10)),
        energy: Math.max(0, currentState.pet.energy - 2), // Playing is tiring
        health: Math.min(100, currentState.pet.health + 0.5),
        cleanliness: Math.max(0, currentState.pet.cleanliness - 1), // Gets dirty while playing
        hunger: Math.max(0, currentState.pet.hunger - 1) // Playing makes hungry
      });
    }, 10000); // Every 10 seconds
    
    // Finish playing after 1.5 minutes
    setTimeout(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state === 'playing') {
        clearInterval(playInterval);
        setState('idle');
        updatePet({
          happiness: Math.min(100, currentState.pet.happiness + 5), // Final happiness boost
          energy: Math.max(0, currentState.pet.energy - 5) // Final energy cost
        });
      }
    }, playDuration);
  }, [pet.energy, pet.happiness, updatePet, setState, playSuccess]);

  const putToSleep = useCallback(() => {
    if (pet.energy > 80) return;
    
    setState('sleeping');
    playHit(); // Gentle sound for sleep
    
    // Sleep takes 3 minutes (180 seconds) to fully restore energy
    const sleepDuration = 180000; // 3 minutes in milliseconds
    const energyGainPerSecond = 70 / 180; // Gain 70 energy over 3 minutes
    
    updatePet({
      lastSlept: Date.now(),
      lastInteraction: Date.now()
    });
    
    // Gradual energy restoration every 10 seconds during sleep
    const sleepInterval = setInterval(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state !== 'sleeping') {
        clearInterval(sleepInterval);
        return;
      }
      
      updatePet({
        energy: Math.min(100, currentState.pet.energy + (energyGainPerSecond * 10)),
        health: Math.min(100, currentState.pet.health + 1),
        // Slight hunger increase during sleep
        hunger: Math.max(0, currentState.pet.hunger - 2)
      });
    }, 10000); // Every 10 seconds
    
    // Wake up after 3 minutes
    setTimeout(() => {
      const currentState = usePet.getState();
      if (currentState.pet.state === 'sleeping') {
        clearInterval(sleepInterval);
        setState('idle');
        updatePet({
          energy: Math.min(100, currentState.pet.energy + 10), // Final energy boost
          health: Math.min(100, currentState.pet.health + 5)
        });
      }
    }, sleepDuration);
  }, [pet.energy, pet.state, updatePet, setState, playHit]);

  const cleanPet = useCallback(() => {
    if (pet.cleanliness > 90) return;
    
    playSuccess();
    
    updatePet({
      cleanliness: Math.min(100, pet.cleanliness + 30),
      happiness: Math.min(100, pet.happiness + 10),
      health: Math.min(100, pet.health + 5),
      lastCleaned: Date.now(),
      lastInteraction: Date.now()
    });
  }, [pet.cleanliness, updatePet, playSuccess]);

  const healPet = useCallback(() => {
    if (pet.health > 90) return;
    
    playSuccess();
    
    updatePet({
      health: Math.min(100, pet.health + 50),
      happiness: Math.min(100, pet.happiness + 15)
    });
  }, [pet.health, updatePet, playSuccess]);

  const giveMedicine = useCallback(() => {
    if (!pet.sickness?.isSick || pet.money < 20) return;
    
    playSuccess();
    
    updatePet({
      lastMedicine: Date.now(),
      health: Math.min(100, pet.health + 10),
      money: pet.money - 20,
      lastInteraction: Date.now()
    });
  }, [pet.sickness, pet.money, updatePet, playSuccess]);

  const sendToHospital = useCallback(() => {
    if (!pet.sickness?.isSick || pet.money < 50) return;
    
    playSuccess();
    
    const treatmentDuration = Math.ceil(pet.sickness.severity / 10); // 1-10 minutes based on severity
    
    updatePet({
      state: 'hospital',
      money: pet.money - 50,
      hospital: {
        isInHospital: true,
        admissionTime: Date.now(),
        treatmentDuration
      },
      lastInteraction: Date.now()
    });
  }, [pet.sickness, pet.money, updatePet, playSuccess]);

  const sendOnVacation = useCallback(() => {
    if (pet.money < 100 || pet.loneliness < 50) return;
    
    playSuccess();
    
    const destinations = ['Beach Resort', 'Mountain Retreat', 'City Adventure', 'Forest Camp', 'Spa Retreat'];
    const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
    
    updatePet({
      state: 'vacation',
      money: pet.money - 100,
      vacation: {
        isOnVacation: true,
        startTime: Date.now(),
        duration: 15, // 15 minutes vacation
        destination: randomDestination
      },
      lastInteraction: Date.now()
    });
  }, [pet.money, pet.loneliness, updatePet, playSuccess]);

  const earnMoney = useCallback(() => {
    if (pet.energy < 30) return;
    
    playSuccess();
    
    const earnings = 10 + Math.floor(Math.random() * 20); // 10-30 coins
    
    updatePet({
      money: pet.money + earnings,
      energy: Math.max(0, pet.energy - 20),
      lastInteraction: Date.now()
    });
  }, [pet.energy, pet.money, updatePet, playSuccess]);

  return {
    feedPet,
    playWithPet,
    putToSleep,
    cleanPet,
    healPet,
    giveMedicine,
    sendToHospital,
    sendOnVacation,
    earnMoney
  };
}
