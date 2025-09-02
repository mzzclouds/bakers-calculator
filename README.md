# Baker's Calculator

A professional web application for scaling recipes and calculating baker's percentages. Perfect for home bakers and professional chefs who need to adjust recipe quantities.

## Features

### 🥧 Recipe Scaling
- Scale recipes up or down with custom ratios
- Quick scale buttons for common multipliers (½x, 2x, 3x, 4x)
- Real-time calculation updates
- Support for multiple ingredient types and units

### 📊 Baker's Percentages
- Calculate baker's percentages for bread recipes
- Automatic hydration level calculation
- Professional bakery-style ingredient ratios

### 🔄 Unit Conversions
- Convert between metric and imperial units
- Intelligent ingredient-specific conversions (flour, sugar, etc.)
- Volume to weight conversions based on ingredient density

### 💾 Recipe Storage
- Save your favorite recipes locally
- Load saved recipes with one click
- Delete unwanted recipes
- Persistent storage using browser localStorage

### 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Clean, professional interface
- Optimized for touch interactions

## Getting Started

1. Open `index.html` in your web browser
2. Start by entering your original recipe yield and desired yield
3. Add ingredients with their amounts and units
4. Watch the scaled recipe update in real-time
5. Save recipes you use frequently

## File Structure

```
bakers-calculator/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # All CSS styles
├── js/
│   ├── app.js              # Main application controller
│   ├── calculator.js       # Recipe scaling logic
│   ├── conversions.js      # Unit conversion utilities
│   └── storage.js          # Local storage management
└── data/
    └── sample-recipes.json # Sample recipes for reference
```

## Usage Examples

### Scaling a Recipe
- Original recipe makes 2 loaves
- You want to make 6 loaves
- The app automatically calculates 3x scaling
- All ingredients are multiplied by 3

### Baker's Percentages
- Set your flour weight as the base (100%)
- Add other ingredients with their percentages
- Automatically calculates total weight and hydration

### Quick Conversions
- Convert cups to grams for precise measurements
- Ingredient-aware conversions (flour vs. sugar vs. butter)
- Instant results as you type

## Browser Compatibility

Works in all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Local Storage

Recipes are stored locally in your browser using localStorage. Your data stays private and is not sent to any external servers.

## Contributing

This is a client-side only application with no build process required. Simply edit the files directly and refresh your browser to see changes.