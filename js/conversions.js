// Unit conversion constants and functions

const CONVERSION_RATES = {
    // Volume conversions (to milliliters)
    milliliters: 1,
    cups: 236.588,
    teaspoons: 4.92892,
    tablespoons: 14.7868,
    
    // Weight conversions (to grams)
    grams: 1,
    ounces: 28.3495,
    pounds: 453.592,
    
    // Common baking ingredient densities (grams per cup)
    flour: {
        'all-purpose flour': 120,
        'bread flour': 120,
        'whole wheat flour': 113,
        'cake flour': 114,
        'flour': 120 // default
    },
    sugar: {
        'granulated sugar': 200,
        'brown sugar': 213,
        'powdered sugar': 120,
        'sugar': 200 // default
    },
    butter: 227,
    oil: 218,
    honey: 340,
    milk: 245,
    water: 236.588 // same as 1 cup = 236.588ml
};

class UnitConverter {
    static isVolumeUnit(unit) {
        return ['milliliters', 'cups', 'teaspoons', 'tablespoons'].includes(unit);
    }
    
    static isWeightUnit(unit) {
        return ['grams', 'ounces', 'pounds'].includes(unit);
    }
    
    static convertVolume(amount, fromUnit, toUnit) {
        if (!this.isVolumeUnit(fromUnit) || !this.isVolumeUnit(toUnit)) {
            throw new Error('Invalid volume units');
        }
        
        // Convert to milliliters first, then to target unit
        const inMilliliters = amount * CONVERSION_RATES[fromUnit];
        return inMilliliters / CONVERSION_RATES[toUnit];
    }
    
    static convertWeight(amount, fromUnit, toUnit) {
        if (!this.isWeightUnit(fromUnit) || !this.isWeightUnit(toUnit)) {
            throw new Error('Invalid weight units');
        }
        
        // Convert to grams first, then to target unit
        const inGrams = amount * CONVERSION_RATES[fromUnit];
        return inGrams / CONVERSION_RATES[toUnit];
    }
    
    static canConvert(fromUnit, toUnit) {
        const fromIsVolume = this.isVolumeUnit(fromUnit);
        const fromIsWeight = this.isWeightUnit(fromUnit);
        const toIsVolume = this.isVolumeUnit(toUnit);
        const toIsWeight = this.isWeightUnit(toUnit);
        
        // Can convert within same category
        return (fromIsVolume && toIsVolume) || (fromIsWeight && toIsWeight);
    }
    
    static convert(amount, fromUnit, toUnit, ingredientName = '') {
        if (!this.canConvert(fromUnit, toUnit)) {
            // Try ingredient-specific conversion for volume to weight
            if (this.isVolumeUnit(fromUnit) && this.isWeightUnit(toUnit)) {
                return this.volumeToWeight(amount, fromUnit, toUnit, ingredientName);
            }
            if (this.isWeightUnit(fromUnit) && this.isVolumeUnit(toUnit)) {
                return this.weightToVolume(amount, fromUnit, toUnit, ingredientName);
            }
            throw new Error(`Cannot convert from ${fromUnit} to ${toUnit}`);
        }
        
        if (this.isVolumeUnit(fromUnit)) {
            return this.convertVolume(amount, fromUnit, toUnit);
        } else {
            return this.convertWeight(amount, fromUnit, toUnit);
        }
    }
    
    static volumeToWeight(amount, fromUnit, toUnit, ingredientName = '') {
        // Convert volume to weight using ingredient density
        const ingredientLower = ingredientName.toLowerCase();
        let density = 120; // default flour density
        
        // Try to find specific density
        for (const [category, values] of Object.entries(CONVERSION_RATES)) {
            if (typeof values === 'object' && !Array.isArray(values)) {
                for (const [ingredient, dens] of Object.entries(values)) {
                    if (ingredientLower.includes(ingredient)) {
                        density = dens;
                        break;
                    }
                }
            } else if (typeof values === 'number' && ingredientLower.includes(category)) {
                density = values;
                break;
            }
        }
        
        // Convert to cups first if not already
        const amountInCups = this.isVolumeUnit(fromUnit) ? 
            this.convertVolume(amount, fromUnit, 'cups') : amount;
        
        // Convert cups to grams using density
        const amountInGrams = amountInCups * density;
        
        // Convert to target weight unit
        return this.convertWeight(amountInGrams, 'grams', toUnit);
    }
    
    static weightToVolume(amount, fromUnit, toUnit, ingredientName = '') {
        // Convert weight to volume using ingredient density
        const ingredientLower = ingredientName.toLowerCase();
        let density = 120; // default flour density
        
        // Try to find specific density
        for (const [category, values] of Object.entries(CONVERSION_RATES)) {
            if (typeof values === 'object' && !Array.isArray(values)) {
                for (const [ingredient, dens] of Object.entries(values)) {
                    if (ingredientLower.includes(ingredient)) {
                        density = dens;
                        break;
                    }
                }
            } else if (typeof values === 'number' && ingredientLower.includes(category)) {
                density = values;
                break;
            }
        }
        
        // Convert to grams first if not already
        const amountInGrams = this.isWeightUnit(fromUnit) ? 
            this.convertWeight(amount, fromUnit, 'grams') : amount;
        
        // Convert grams to cups using density
        const amountInCups = amountInGrams / density;
        
        // Convert to target volume unit
        return this.convertVolume(amountInCups, 'cups', toUnit);
    }
    
    static formatAmount(amount, unit) {
        // For pieces, always round to whole numbers
        if (unit === 'pieces') {
            const rounded = Math.round(amount);
            return `${rounded} ${this.getUnitAbbreviation(unit)}`;
        }
        
        const rounded = Math.round(amount * 100) / 100;
        
        // Add helpful conversions for display
        if (unit === 'grams' && rounded > 453) {
            const pounds = this.convertWeight(rounded, 'grams', 'pounds');
            return `${rounded} g (${Math.round(pounds * 100) / 100} lbs)`;
        }
        
        if (unit === 'milliliters' && rounded > 236) {
            const cups = this.convertVolume(rounded, 'milliliters', 'cups');
            return `${rounded} ml (${Math.round(cups * 100) / 100} cups)`;
        }
        
        if (unit === 'grams' && rounded >= 15) {
            const tbsp = rounded / 14.7868; // rough approximation
            if (tbsp >= 1) {
                return `${rounded} g (~${Math.round(tbsp)} tbsp)`;
            }
        }
        
        return `${rounded} ${this.getUnitAbbreviation(unit)}`;
    }
    
    static getUnitAbbreviation(unit) {
        const abbreviations = {
            grams: 'g',
            ounces: 'oz',
            pounds: 'lbs',
            milliliters: 'ml',
            cups: 'cups',
            teaspoons: 'tsp',
            tablespoons: 'tbsp',
            pieces: 'pieces'
        };
        return abbreviations[unit] || unit;
    }
}

// Make UnitConverter available globally
window.UnitConverter = UnitConverter;