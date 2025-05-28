# 3D Tamagotchi Virtual Pet Game 🐾

A modern 3D Tamagotchi-style virtual pet game built with React, Three.js, and TypeScript. Care for your adorable 3D pet, manage their needs, and watch them grow and evolve!

## Features ✨

- **3D Pet Visualization**: Different pet types (Cat, Dog, Bird, Rabbit) with unique shapes and animations
- **Pet Care System**: Feed, play, sleep, clean, and give medicine to keep your pet happy
- **Evolution System**: Watch your pet grow from baby to adult stages
- **Hospital & Vacation**: Professional healthcare and relaxing trips for your pet
- **Money System**: Earn coins through work and spend on premium items
- **Store System**: Buy premium foods and appliances that appear in the 3D environment
- **Sickness & Health**: Realistic health system with different illness types
- **Loneliness Tracking**: Monitor your pet's emotional needs
- **Day/Night Cycle**: Dynamic lighting and environment changes
- **Collapsible UI**: Clean interface that doesn't block your pet
- **Local Storage**: Your pet's data persists between sessions

## How to Play 🎮

1. **Basic Care**: Use the bottom buttons to feed, play, sleep, and clean your pet
2. **Monitor Stats**: Click the dropdown arrow to view detailed health statistics
3. **Shopping**: Click the shopping cart to buy premium foods and decorative items
4. **Work for Money**: Use the Work button to earn coins (costs energy)
5. **Healthcare**: Buy medicine (20 coins) or send to hospital (50 coins) when sick
6. **Vacations**: Send lonely pets on vacation (100 coins) to boost happiness
7. **Watch Growth**: Your pet evolves through different life stages as they age

## Pet Types 🐱🐶🐦🐰

- **Cat**: Orange with pointy ears and a swishing tail
- **Dog**: Brown with floppy ears and a wagging tail  
- **Bird**: Blue with wings and a beak
- **Rabbit**: White with long ears and a fluffy tail

## Store Items 🛒

### Premium Foods (Immediate Effects)
- 🥩 Premium Meat (30 coins): +40 Hunger, +10 Health
- 🍰 Birthday Cake (50 coins): +20 Hunger, +30 Happiness
- 🥛 Health Milk (25 coins): +15 Hunger, +20 Health
- 🍭 Happy Candy (20 coins): +10 Hunger, +25 Happiness
- 🍕 Pizza Slice (35 coins): +30 Hunger, +15 Happiness
- 🍎 Magic Apple (40 coins): +25 Hunger, +25 Health

### Appliances & Toys (Permanent Additions)
- 🎾 Super Ball (60 coins): Golden ball appears in environment
- 🪑 Comfort Chair (80 coins): Luxury seating for better rest
- 🌺 Flower Pot (40 coins): Beautiful decoration for mood boost
- 🎪 Mini Playground (120 coins): Complete play area with slide and swing
- 🪴 Garden Set (70 coins): Multiple decorative plants
- 🏠 Pet House Upgrade (150 coins): Luxury mansion with windows and door

## Deployment to GitHub Pages 🚀

1. **Prepare Your Repository**:
   ```bash
   git add .
   git commit -m "Add 3D Tamagotchi Game"
   git push origin main
   ```

2. **Build for GitHub Pages**:
   ```bash
   npm run build
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder (or upload the dist folder contents)

4. **Your game will be live at**: `https://yourusername.github.io/your-repo-name`

## Development 🛠️

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies Used 💻

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics and animations
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for 3D scenes
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - Lightweight state management
- **Vite** - Fast development and building

## Game Tips 💡

- **Keep your pet healthy**: Monitor all stats regularly and respond to alerts
- **Work smartly**: Balance earning money with maintaining your pet's energy
- **Invest in appliances**: They provide permanent benefits and beautify the environment
- **Watch for loneliness**: Interact with your pet regularly to prevent sadness
- **Plan treatments**: Hospital visits cure all illnesses but cost more than medicine
- **Save money**: Expensive items like the mansion and playground are worth saving for

Enjoy caring for your virtual pet! 🎉