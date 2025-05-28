import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Pet {
  name: string;
  hunger: number; // 0-100
  happiness: number; // 0-100
  health: number; // 0-100
  energy: number; // 0-100
  cleanliness: number; // 0-100
  age: number; // in minutes
  state: 'idle' | 'eating' | 'playing' | 'sleeping' | 'sick' | 'hospital' | 'vacation';
  lastFed: number | null;
  lastPlayed: number | null;
  lastSlept: number | null;
  lastCleaned: number | null;
  lastMedicine: number | null;
  lastInteraction: number | null;
  birthTime: number;
  petType: 'cat' | 'dog' | 'bird' | 'rabbit';
  money: number; // Virtual currency
  sickness: {
    isSick: boolean;
    type: 'none' | 'cold' | 'stomach' | 'sadness' | 'fatigue';
    severity: number; // 0-100
    duration: number; // minutes sick
  };
  evolution: {
    stage: 'baby' | 'child' | 'teen' | 'adult';
    nextEvolution: number; // age in minutes
  };
  hospital: {
    isInHospital: boolean;
    admissionTime: number | null;
    treatmentDuration: number; // minutes
  };
  vacation: {
    isOnVacation: boolean;
    startTime: number | null;
    duration: number; // minutes
    destination: string;
  };
  loneliness: number; // 0-100, increases when not interacted with
  inventory: {
    foods: string[]; // Premium foods
    appliances: string[]; // Toys, furniture, etc.
  };
}

interface PetState {
  pet: Pet;
  updatePet: (updates: Partial<Pet>) => void;
  resetPet: () => void;
  loadPet: () => void;
  savePet: () => void;
  setState: (state: Pet['state']) => void;
}

const createNewPet = (): Pet => {
  const petTypes: Pet['petType'][] = ['cat', 'dog', 'bird', 'rabbit'];
  const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
  
  return {
    name: "Buddy",
    hunger: 80,
    happiness: 80,
    health: 100,
    energy: 80,
    cleanliness: 100,
    age: 0,
    state: 'idle',
    lastFed: null,
    lastPlayed: null,
    lastSlept: null,
    lastCleaned: null,
    lastMedicine: null,
    lastInteraction: Date.now(),
    birthTime: Date.now(),
    petType: randomType,
    money: 100, // Starting money
    sickness: {
      isSick: false,
      type: 'none',
      severity: 0,
      duration: 0
    },
    evolution: {
      stage: 'baby',
      nextEvolution: 30 // Evolve after 30 minutes
    },
    hospital: {
      isInHospital: false,
      admissionTime: null,
      treatmentDuration: 0
    },
    vacation: {
      isOnVacation: false,
      startTime: null,
      duration: 0,
      destination: ''
    },
    loneliness: 0,
    inventory: {
      foods: [],
      appliances: []
    }
  };
};

export const usePet = create<PetState>()(
  subscribeWithSelector((set, get) => ({
    pet: createNewPet(),
    
    updatePet: (updates) => {
      set((state) => {
        const updatedPet = { ...state.pet, ...updates };
        
        // Ensure values stay within bounds
        updatedPet.hunger = Math.max(0, Math.min(100, updatedPet.hunger));
        updatedPet.happiness = Math.max(0, Math.min(100, updatedPet.happiness));
        updatedPet.health = Math.max(0, Math.min(100, updatedPet.health));
        updatedPet.energy = Math.max(0, Math.min(100, updatedPet.energy));
        updatedPet.cleanliness = Math.max(0, Math.min(100, updatedPet.cleanliness));
        
        // Calculate age based on birth time
        updatedPet.age = Math.floor((Date.now() - updatedPet.birthTime) / 60000);
        
        // Handle loneliness - increases when not interacted with
        const timeSinceInteraction = updatedPet.lastInteraction ? Date.now() - updatedPet.lastInteraction : 0;
        const minutesSinceInteraction = Math.floor(timeSinceInteraction / 60000);
        updatedPet.loneliness = Math.min(100, Math.max(0, minutesSinceInteraction * 0.5));

        // Handle hospital treatment
        if (updatedPet.hospital.isInHospital && updatedPet.hospital.admissionTime) {
          const treatmentTime = Math.floor((Date.now() - updatedPet.hospital.admissionTime) / 60000);
          if (treatmentTime >= updatedPet.hospital.treatmentDuration) {
            // Treatment complete
            updatedPet.hospital.isInHospital = false;
            updatedPet.hospital.admissionTime = null;
            updatedPet.sickness.isSick = false;
            updatedPet.sickness.type = 'none';
            updatedPet.sickness.severity = 0;
            updatedPet.sickness.duration = 0;
            updatedPet.health = Math.min(100, updatedPet.health + 50);
            updatedPet.state = 'idle';
          }
        }

        // Handle vacation
        if (updatedPet.vacation.isOnVacation && updatedPet.vacation.startTime) {
          const vacationTime = Math.floor((Date.now() - updatedPet.vacation.startTime) / 60000);
          if (vacationTime >= updatedPet.vacation.duration) {
            // Vacation complete
            updatedPet.vacation.isOnVacation = false;
            updatedPet.vacation.startTime = null;
            updatedPet.happiness = Math.min(100, updatedPet.happiness + 30);
            updatedPet.energy = Math.min(100, updatedPet.energy + 20);
            updatedPet.loneliness = Math.max(0, updatedPet.loneliness - 20);
            updatedPet.state = 'idle';
          }
        }

        // Handle sickness progression (only if not in hospital or vacation)
        if (!updatedPet.hospital.isInHospital && !updatedPet.vacation.isOnVacation) {
          if (updatedPet.sickness.isSick) {
            updatedPet.sickness.duration += 1;
            // Sickness affects stats
            if (updatedPet.sickness.type === 'cold') {
              updatedPet.energy = Math.max(0, updatedPet.energy - 0.5);
            } else if (updatedPet.sickness.type === 'stomach') {
              updatedPet.hunger = Math.max(0, updatedPet.hunger - 1);
            } else if (updatedPet.sickness.type === 'sadness') {
              updatedPet.happiness = Math.max(0, updatedPet.happiness - 1);
            } else if (updatedPet.sickness.type === 'fatigue') {
              updatedPet.energy = Math.max(0, updatedPet.energy - 1);
            }
            
            // Recovery chance if treated with medicine
            if (updatedPet.lastMedicine && Date.now() - updatedPet.lastMedicine < 600000) { // 10 minutes
              updatedPet.sickness.severity = Math.max(0, updatedPet.sickness.severity - 2);
              if (updatedPet.sickness.severity <= 0) {
                updatedPet.sickness.isSick = false;
                updatedPet.sickness.type = 'none';
                updatedPet.sickness.duration = 0;
              }
            }
          }
        }

        // Check for new sickness (random chance based on care)
        if (!updatedPet.sickness.isSick && Math.random() < 0.001) { // 0.1% chance per update
          const sickChance = (100 - updatedPet.health) + (100 - updatedPet.cleanliness);
          if (sickChance > 50 && Math.random() < 0.1) {
            const sickTypes: Pet['sickness']['type'][] = ['cold', 'stomach', 'sadness', 'fatigue'];
            const randomSickness = sickTypes[Math.floor(Math.random() * (sickTypes.length - 1)) + 1]; // Exclude 'none'
            updatedPet.sickness = {
              isSick: true,
              type: randomSickness,
              severity: 20 + Math.random() * 60,
              duration: 0
            };
          }
        }

        // Handle evolution
        if (updatedPet.age >= updatedPet.evolution.nextEvolution) {
          if (updatedPet.evolution.stage === 'baby') {
            updatedPet.evolution.stage = 'child';
            updatedPet.evolution.nextEvolution = updatedPet.age + 60; // 1 hour
          } else if (updatedPet.evolution.stage === 'child') {
            updatedPet.evolution.stage = 'teen';
            updatedPet.evolution.nextEvolution = updatedPet.age + 120; // 2 hours
          } else if (updatedPet.evolution.stage === 'teen') {
            updatedPet.evolution.stage = 'adult';
            updatedPet.evolution.nextEvolution = updatedPet.age + 999999; // No more evolution
          }
        }

        // Auto-update state based on stats
        if (updatedPet.sickness.isSick) {
          updatedPet.state = 'sick';
        } else if (updatedPet.health < 20) {
          updatedPet.state = 'sick';
        } else if (updatedPet.energy < 20) {
          updatedPet.state = 'sleeping';
        } else if (updatedPet.state === 'sick' && updatedPet.health > 50 && !updatedPet.sickness.isSick) {
          updatedPet.state = 'idle';
        } else if (updatedPet.state === 'sleeping' && updatedPet.energy > 50) {
          updatedPet.state = 'idle';
        }
        
        // Save to localStorage
        setTimeout(() => {
          localStorage.setItem('tamagotchi-pet', JSON.stringify(updatedPet));
        }, 0);
        
        return { pet: updatedPet };
      });
    },
    
    resetPet: () => {
      const newPet = createNewPet();
      set({ pet: newPet });
      localStorage.setItem('tamagotchi-pet', JSON.stringify(newPet));
    },
    
    loadPet: () => {
      try {
        const saved = localStorage.getItem('tamagotchi-pet');
        if (saved) {
          const petData = JSON.parse(saved);
          
          // Migrate old data to new structure
          const newPet = createNewPet();
          const migratedPet = {
            ...newPet,
            ...petData,
            // Ensure new fields exist
            lastMedicine: petData.lastMedicine || null,
            lastInteraction: petData.lastInteraction || newPet.lastInteraction,
            petType: petData.petType || newPet.petType,
            money: petData.money || newPet.money,
            sickness: petData.sickness || newPet.sickness,
            evolution: petData.evolution || newPet.evolution,
            hospital: petData.hospital || newPet.hospital,
            vacation: petData.vacation || newPet.vacation,
            loneliness: petData.loneliness || newPet.loneliness,
            inventory: petData.inventory || newPet.inventory
          };
          
          // Calculate time away and apply stat decay
          const timeAway = Date.now() - (migratedPet.lastSaved || migratedPet.birthTime);
          const minutesAway = Math.floor(timeAway / 60000);
          
          if (minutesAway > 0) {
            // Apply decay for time away
            migratedPet.hunger = Math.max(0, migratedPet.hunger - minutesAway * 0.5);
            migratedPet.happiness = Math.max(0, migratedPet.happiness - minutesAway * 0.3);
            migratedPet.energy = Math.max(0, migratedPet.energy - minutesAway * 0.2);
            migratedPet.cleanliness = Math.max(0, migratedPet.cleanliness - minutesAway * 0.1);
            
            if (migratedPet.hunger < 20 || migratedPet.happiness < 20) {
              migratedPet.health = Math.max(0, migratedPet.health - minutesAway * 0.5);
            }
          }
          
          set({ pet: migratedPet });
        }
      } catch (error) {
        console.error('Failed to load pet data:', error);
        get().resetPet();
      }
    },
    
    savePet: () => {
      const pet = get().pet;
      const saveData = {
        ...pet,
        lastSaved: Date.now()
      };
      localStorage.setItem('tamagotchi-pet', JSON.stringify(saveData));
    },
    
    setState: (state) => {
      get().updatePet({ state });
    }
  }))
);

// Continuous stat decay system - makes all stats decrease over time for challenge
setInterval(() => {
  const state = usePet.getState();
  const pet = state.pet;
  
  // Only decay if pet is idle or sick (not during activities)
  if (pet.state === 'idle' || pet.state === 'sick') {
    // Base decay rates per 30 seconds (challenging but fair)
    const hungerDecay = 2.0;      // Hunger decreases fastest - need to feed often
    const happinessDecay = 1.5;   // Happiness needs regular attention
    const healthDecay = 0.5;      // Health decreases slowly unless sick
    const energyDecay = 1.0;      // Energy decreases moderately
    const cleanlinessDecay = 0.8; // Gets dirty over time
    const lonelinessIncrease = 1.2; // Loneliness increases without interaction
    
    state.updatePet({
      hunger: Math.max(0, pet.hunger - hungerDecay),
      happiness: Math.max(0, pet.happiness - happinessDecay),
      health: Math.max(0, pet.health - (pet.sickness.isSick ? healthDecay * 3 : healthDecay)),
      energy: Math.max(0, pet.energy - energyDecay),
      cleanliness: Math.max(0, pet.cleanliness - cleanlinessDecay),
      loneliness: Math.min(100, pet.loneliness + lonelinessIncrease),
      age: pet.age + 0.5 // Age increases by 0.5 minutes every 30 seconds
    });
  }
}, 30000); // Every 30 seconds for challenging gameplay

// Auto-save periodically
setInterval(() => {
  usePet.getState().savePet();
}, 30000); // Save every 30 seconds
