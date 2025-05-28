import { useState, useEffect } from "react";
import { Heart, Utensils, Gamepad2, Moon, Volume2, VolumeX, RotateCcw, ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { usePet } from "../lib/stores/usePet";
import { useGameTime } from "../lib/stores/useGameTime";
import { useAudio } from "../lib/stores/useAudio";
import { usePetCare } from "../hooks/usePetCare";

export default function GameUI() {
  const { pet, resetPet, updatePet } = usePet();
  const { isNight, toggleDayNight, gameTime } = useGameTime();
  const { isMuted, toggleMute } = useAudio();
  const { feedPet, playWithPet, putToSleep, cleanPet, giveMedicine, sendToHospital, sendOnVacation, earnMoney } = usePetCare();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statsCollapsed, setStatsCollapsed] = useState(true);
  const [showStore, setShowStore] = useState(false);

  // Calculate time since last interaction
  const getTimeSinceLastAction = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  // Get status color based on value
  const getStatusColor = (value: number) => {
    if (value > 70) return "bg-green-500";
    if (value > 40) return "bg-yellow-500";
    if (value > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Get pet mood based on stats
  const getPetMood = () => {
    const avgStats = (pet.hunger + pet.happiness + pet.health + pet.energy) / 4;
    if (avgStats > 80) return "😊 Happy";
    if (avgStats > 60) return "🙂 Content";
    if (avgStats > 40) return "😐 Okay";
    if (avgStats > 20) return "😟 Sad";
    return "😵 Critical";
  };

  // Age formatting
  const formatAge = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  // Store item component
  const StoreItem = ({ name, price, effect, category, id }: {
    name: string;
    price: number;
    effect: string;
    category: 'foods' | 'appliances';
    id: string;
  }) => {
    const canAfford = (pet.money || 0) >= price;
    const alreadyOwned = category === 'appliances' && pet.inventory?.appliances.includes(id);

    const handlePurchase = () => {
      if (!canAfford || alreadyOwned) return;

      updatePet({
        money: (pet.money || 0) - price,
        inventory: {
          ...pet.inventory,
          [category]: [...(pet.inventory?.[category] || []), id]
        },
        lastInteraction: Date.now()
      });

      // Apply immediate effects for foods
      if (category === 'foods') {
        switch (id) {
          case 'premium_meat':
            updatePet({
              hunger: Math.min(100, pet.hunger + 40),
              health: Math.min(100, pet.health + 10)
            });
            break;
          case 'birthday_cake':
            updatePet({
              hunger: Math.min(100, pet.hunger + 20),
              happiness: Math.min(100, pet.happiness + 30)
            });
            break;
          case 'health_milk':
            updatePet({
              hunger: Math.min(100, pet.hunger + 15),
              health: Math.min(100, pet.health + 20)
            });
            break;
          case 'happy_candy':
            updatePet({
              hunger: Math.min(100, pet.hunger + 10),
              happiness: Math.min(100, pet.happiness + 25)
            });
            break;
          case 'pizza_slice':
            updatePet({
              hunger: Math.min(100, pet.hunger + 30),
              happiness: Math.min(100, pet.happiness + 15)
            });
            break;
          case 'magic_apple':
            updatePet({
              hunger: Math.min(100, pet.hunger + 25),
              health: Math.min(100, pet.health + 25)
            });
            break;
        }
      }
    };

    return (
      <div className="bg-gray-800 p-2 rounded border border-gray-600">
        <div className="text-xs font-medium mb-1">{name}</div>
        <div className="text-xs text-gray-400 mb-2">{effect}</div>
        <Button
          size="sm"
          onClick={handlePurchase}
          disabled={!canAfford || alreadyOwned}
          className={`w-full text-xs ${
            alreadyOwned 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : canAfford 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {alreadyOwned ? 'Owned' : `${price}💰`}
        </Button>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Collapsible Top Status Bar */}
      <div className="absolute top-2 left-4 right-4 pointer-events-auto">
        <Card className="bg-black/80 text-white border-gray-600">
          <CardContent className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-lg font-bold">{pet.name} the {pet.petType}</h1>
                  <p className="text-xs text-gray-300">
                    💰 {pet.money || 0} • {pet.evolution?.stage || 'baby'} • {getPetMood()}
                  </p>
                </div>
                {/* Quick status indicators */}
                <div className="flex gap-2">
                  {pet.sickness?.isSick && <span className="text-red-400 text-sm">🤒</span>}
                  {pet.hospital?.isInHospital && <span className="text-blue-400 text-sm">🏥</span>}
                  {pet.vacation?.isOnVacation && <span className="text-green-400 text-sm">🏖️</span>}
                  {(pet.loneliness || 0) > 70 && <span className="text-purple-400 text-sm animate-pulse">💔</span>}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowStore(!showStore)}
                  className="text-white hover:bg-white/20"
                >
                  <ShoppingCart size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatsCollapsed(!statsCollapsed)}
                  className="text-white hover:bg-white/20"
                >
                  {statsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleDayNight}
                  className="text-white hover:bg-white/20"
                >
                  {isNight ? "🌙" : "☀️"}
                </Button>
              </div>
            </div>
            
            {/* Expandable Stats */}
            {!statsCollapsed && (
              <div className="mt-4 pt-3 border-t border-gray-600">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Heart size={14} className="text-red-400" />
                      <span className="text-xs">Health</span>
                    </div>
                    <Progress value={pet.health} className="h-1" />
                    <span className="text-xs text-gray-400">{pet.health.toFixed(0)}%</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Utensils size={14} className="text-yellow-400" />
                      <span className="text-xs">Hunger</span>
                    </div>
                    <Progress value={pet.hunger} className="h-1" />
                    <span className="text-xs text-gray-400">{pet.hunger.toFixed(0)}%</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-blue-400 text-sm">😊</span>
                      <span className="text-xs">Happy</span>
                    </div>
                    <Progress value={pet.happiness} className="h-1" />
                    <span className="text-xs text-gray-400">{pet.happiness.toFixed(0)}%</span>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-purple-400 text-sm">⚡</span>
                      <span className="text-xs">Energy</span>
                    </div>
                    <Progress value={pet.energy} className="h-1" />
                    <span className="text-xs text-gray-400">{pet.energy.toFixed(0)}%</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-pink-400 text-sm">💔</span>
                      <span className="text-xs">Lonely</span>
                    </div>
                    <Progress value={pet.loneliness || 0} className="h-1" />
                    <span className="text-xs text-gray-400">{(pet.loneliness || 0).toFixed(0)}%</span>
                  </div>
                </div>
                
                {pet.sickness?.isSick && (
                  <p className="text-xs text-red-400 mt-2">
                    Sick: {pet.sickness.type} (Severity: {pet.sickness.severity?.toFixed(0) || 0}%)
                  </p>
                )}
                {pet.hospital?.isInHospital && (
                  <p className="text-xs text-blue-400 mt-2">🏥 In Hospital - Treatment in progress...</p>
                )}
                {pet.vacation?.isOnVacation && (
                  <p className="text-xs text-green-400 mt-2">🏖️ On Vacation at {pet.vacation.destination}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={feedPet}
            disabled={pet.hunger > 90}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Utensils size={16} className="mr-2" />
            Feed
            {pet.lastFed && (
              <span className="ml-2 text-xs opacity-75">
                ({getTimeSinceLastAction(pet.lastFed)})
              </span>
            )}
          </Button>
          
          <Button
            onClick={playWithPet}
            disabled={pet.energy < 20 || pet.happiness > 90}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Gamepad2 size={16} className="mr-2" />
            Play
            {pet.lastPlayed && (
              <span className="ml-2 text-xs opacity-75">
                ({getTimeSinceLastAction(pet.lastPlayed)})
              </span>
            )}
          </Button>
          
          <Button
            onClick={putToSleep}
            disabled={pet.energy > 80}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Moon size={16} className="mr-2" />
            Sleep
            {pet.lastSlept && (
              <span className="ml-2 text-xs opacity-75">
                ({getTimeSinceLastAction(pet.lastSlept)})
              </span>
            )}
          </Button>
          
          <Button
            onClick={cleanPet}
            disabled={pet.cleanliness > 90}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            🧽 Clean
            {pet.lastCleaned && (
              <span className="ml-2 text-xs opacity-75">
                ({getTimeSinceLastAction(pet.lastCleaned)})
              </span>
            )}
          </Button>

          {pet.sickness?.isSick && (
            <>
              <Button
                onClick={giveMedicine}
                disabled={(pet.money || 0) < 20}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                💊 Medicine (20💰)
                {pet.lastMedicine && (
                  <span className="ml-2 text-xs opacity-75">
                    ({getTimeSinceLastAction(pet.lastMedicine)})
                  </span>
                )}
              </Button>
              
              <Button
                onClick={sendToHospital}
                disabled={(pet.money || 0) < 50}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                🏥 Hospital (50💰)
              </Button>
            </>
          )}

          {(pet.loneliness || 0) > 50 && (pet.money || 0) >= 100 && (
            <Button
              onClick={sendOnVacation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              🏖️ Vacation (100💰)
            </Button>
          )}

          <Button
            onClick={earnMoney}
            disabled={pet.energy < 30}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            💼 Work
          </Button>
        </div>
        
        {/* Reset Button */}
        <div className="flex justify-center mt-2">
          {!showResetConfirm ? (
            <Button
              onClick={() => setShowResetConfirm(true)}
              variant="outline"
              size="sm"
              className="bg-black/50 text-white border-gray-600 hover:bg-red-600/50"
            >
              <RotateCcw size={14} className="mr-1" />
              Reset Pet
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  resetPet();
                  setShowResetConfirm(false);
                }}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Reset
              </Button>
              <Button
                onClick={() => setShowResetConfirm(false)}
                size="sm"
                variant="outline"
                className="bg-black/50 text-white border-gray-600"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Store Interface */}
      {showStore && (
        <div className="absolute top-20 right-4 pointer-events-auto">
          <Card className="bg-black/90 text-white border-gray-600 w-80 max-h-96">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">🛒 Pet Store</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowStore(false)}
                  className="text-white hover:bg-white/20"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <div>
                  <h4 className="text-sm font-bold mb-2 text-yellow-400">🍎 Premium Foods</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <StoreItem 
                      name="🥩 Premium Meat" 
                      price={30} 
                      effect="+40 Hunger, +10 Health"
                      category="foods"
                      id="premium_meat"
                    />
                    <StoreItem 
                      name="🍰 Birthday Cake" 
                      price={50} 
                      effect="+20 Hunger, +30 Happiness"
                      category="foods"
                      id="birthday_cake"
                    />
                    <StoreItem 
                      name="🥛 Health Milk" 
                      price={25} 
                      effect="+15 Hunger, +20 Health"
                      category="foods"
                      id="health_milk"
                    />
                    <StoreItem 
                      name="🍭 Happy Candy" 
                      price={20} 
                      effect="+10 Hunger, +25 Happiness"
                      category="foods"
                      id="happy_candy"
                    />
                    <StoreItem 
                      name="🍕 Pizza Slice" 
                      price={35} 
                      effect="+30 Hunger, +15 Happiness"
                      category="foods"
                      id="pizza_slice"
                    />
                    <StoreItem 
                      name="🍎 Magic Apple" 
                      price={40} 
                      effect="+25 Hunger, +25 Health"
                      category="foods"
                      id="magic_apple"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold mb-2 text-blue-400">🎾 Appliances & Toys</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <StoreItem 
                      name="🎾 Super Ball" 
                      price={60} 
                      effect="Appears in environment"
                      category="appliances"
                      id="super_ball"
                    />
                    <StoreItem 
                      name="🪑 Comfort Chair" 
                      price={80} 
                      effect="Better rest quality"
                      category="appliances"
                      id="comfort_chair"
                    />
                    <StoreItem 
                      name="🌺 Flower Pot" 
                      price={40} 
                      effect="Decoration & mood boost"
                      category="appliances"
                      id="flower_pot"
                    />
                    <StoreItem 
                      name="🎪 Mini Playground" 
                      price={120} 
                      effect="Enhanced play area"
                      category="appliances"
                      id="mini_playground"
                    />
                    <StoreItem 
                      name="🪴 Garden Set" 
                      price={70} 
                      effect="Multiple decorations"
                      category="appliances"
                      id="garden_set"
                    />
                    <StoreItem 
                      name="🏠 Pet House Upgrade" 
                      price={150} 
                      effect="Luxury pet mansion"
                      category="appliances"
                      id="pet_mansion"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Critical Alerts */}
      {pet.health < 20 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Card className="bg-red-600/90 text-white border-red-400">
            <CardContent className="p-4 text-center">
              <h2 className="text-lg font-bold mb-2">⚠️ Critical Health!</h2>
              <p className="text-sm">Your pet needs immediate care!</p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {(pet.hunger < 10 || pet.happiness < 10) && (
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          <Card className="bg-orange-600/90 text-white border-orange-400">
            <CardContent className="p-3 text-center">
              <p className="text-sm">
                {pet.hunger < 10 ? "🍽️ Very Hungry!" : "😢 Very Sad!"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
