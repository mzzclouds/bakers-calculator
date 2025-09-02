// Main recipe scaling calculator functionality

// Smart defaults for ingredient units
const ingredientDefaults = {
    'flour': 'grams',
    'bread flour': 'grams',
    'all-purpose flour': 'grams',
    'whole wheat flour': 'grams',
    'sugar': 'tablespoons',
    'brown sugar': 'tablespoons',
    'white sugar': 'tablespoons',
    'powdered sugar': 'tablespoons',
    'eggs': 'pieces',
    'egg': 'pieces',
    'egg yolk': 'pieces',
    'egg white': 'pieces',
    'milk': 'milliliters',
    'whole milk': 'milliliters',
    'buttermilk': 'milliliters',
    'water': 'milliliters',
    'butter': 'tablespoons',
    'unsalted butter': 'tablespoons',
    'salted butter': 'tablespoons',
    'salt': 'teaspoons',
    'sea salt': 'teaspoons',
    'vanilla': 'teaspoons',
    'vanilla extract': 'teaspoons',
    'baking powder': 'teaspoons',
    'baking soda': 'teaspoons',
    'yeast': 'teaspoons',
    'active dry yeast': 'teaspoons',
    'instant yeast': 'teaspoons',
    'oil': 'milliliters',
    'olive oil': 'milliliters',
    'vegetable oil': 'milliliters',
    'honey': 'grams',
    'maple syrup': 'milliliters',
    'cream': 'milliliters',
    'heavy cream': 'milliliters',
    'sour cream': 'grams',
    'yogurt': 'grams',
    'cheese': 'grams',
    'cocoa powder': 'grams',
    'chocolate': 'grams',
    'nuts': 'grams',
    'almonds': 'grams',
    'walnuts': 'grams'
};

class RecipeCalculator {
    constructor() {
        this.initializeEventListeners();
        this.calculateScaledRecipe(); // Initial calculation
    }
    
    initializeEventListeners() {
        // Scaling controls
        const originalYield = document.getElementById('original-yield');
        const desiredYield = document.getElementById('desired-yield');
        
        originalYield?.addEventListener('input', () => this.calculateScaledRecipe());
        desiredYield?.addEventListener('input', () => this.calculateScaledRecipe());
        
        // Quick scale buttons
        document.querySelectorAll('.scale-btn, .compact-scale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const factor = parseFloat(e.target.dataset.factor);
                this.quickScale(factor);
            });
        });
        
        // Add ingredient button
        const addBtn = document.querySelector('.add-ingredient');
        addBtn?.addEventListener('click', () => this.addIngredientRow());
        
        // Save recipe button
        const saveBtn = document.querySelector('.save-recipe-btn');
        saveBtn?.addEventListener('click', () => this.saveCurrentRecipe());
        
        // Clear recipe button
        const clearBtn = document.querySelector('.clear-recipe-btn');
        clearBtn?.addEventListener('click', () => this.clearRecipe());
        
        
        // Initial ingredient row listeners
        this.addIngredientListeners();
    }
    
    addIngredientListeners() {
        document.querySelectorAll('.ingredient-row').forEach(row => {
            if (!row.dataset.listenersAdded) {
                row.dataset.listenersAdded = 'true';
                
                // Remove button
                const removeBtn = row.querySelector('.remove-btn');
                removeBtn?.addEventListener('click', () => {
                    row.remove();
                    this.calculateScaledRecipe();
                });
                
                // Ingredient name input listener for smart unit defaults
                const nameInput = row.querySelector('.ingredient-name');
                if (nameInput) {
                    nameInput.addEventListener('input', (e) => {
                        this.handleIngredientNameChange(e.target, row);
                        this.calculateScaledRecipe();
                    });
                    
                    // Also listen for blur to catch paste operations
                    nameInput.addEventListener('blur', (e) => {
                        this.handleIngredientNameChange(e.target, row);
                    });
                }
                
                // Other input change listeners
                row.querySelectorAll('input:not(.ingredient-name), select').forEach(input => {
                    input.addEventListener('input', () => this.calculateScaledRecipe());
                });
            }
        });
    }
    
    handleIngredientNameChange(nameInput, row) {
        const ingredientName = nameInput.value.toLowerCase().trim();
        if (!ingredientName) return;
        
        const unitSelect = row.querySelector('.ingredient-unit');
        if (!unitSelect) return;
        
        // Check if unit has been manually changed by user
        if (unitSelect.dataset.userModified === 'true') return;
        
        // Find matching unit from defaults
        const matchedUnit = this.findBestUnitMatch(ingredientName);
        if (matchedUnit && unitSelect.value !== matchedUnit) {
            unitSelect.value = matchedUnit;
            
            // Add a small visual feedback
            unitSelect.style.transition = 'background-color 0.3s ease';
            unitSelect.style.backgroundColor = 'rgba(160, 134, 108, 0.1)';
            setTimeout(() => {
                unitSelect.style.backgroundColor = '';
            }, 1000);
        }
        
        // Mark unit select as auto-set (not user modified) initially
        if (!unitSelect.dataset.hasOwnProperty('userModified')) {
            unitSelect.addEventListener('change', function() {
                this.dataset.userModified = 'true';
            }, { once: false });
        }
    }
    
    findBestUnitMatch(ingredientName) {
        // First try exact match
        if (ingredientDefaults[ingredientName]) {
            return ingredientDefaults[ingredientName];
        }
        
        // Try partial matches - check if any key contains the ingredient name or vice versa
        for (const [key, unit] of Object.entries(ingredientDefaults)) {
            if (ingredientName.includes(key) || key.includes(ingredientName)) {
                return unit;
            }
        }
        
        // Try more flexible matching for common patterns
        if (ingredientName.includes('flour')) return 'grams';
        if (ingredientName.includes('sugar')) return 'tablespoons';
        if (ingredientName.includes('milk')) return 'milliliters';
        if (ingredientName.includes('water')) return 'milliliters';
        if (ingredientName.includes('oil')) return 'milliliters';
        if (ingredientName.includes('butter')) return 'tablespoons';
        if (ingredientName.includes('egg')) return 'pieces';
        if (ingredientName.includes('yeast')) return 'teaspoons';
        if (ingredientName.includes('salt')) return 'teaspoons';
        if (ingredientName.includes('vanilla')) return 'teaspoons';
        if (ingredientName.includes('baking')) return 'teaspoons';
        if (ingredientName.includes('powder')) return 'teaspoons';
        if (ingredientName.includes('spice') || ingredientName.includes('cinnamon') || ingredientName.includes('nutmeg')) return 'teaspoons';
        
        return null; // No match found
    }
    
    quickScale(factor) {
        const originalYieldInput = document.getElementById('original-yield');
        const desiredYieldInput = document.getElementById('desired-yield');
        
        if (originalYieldInput && desiredYieldInput) {
            const originalYield = parseFloat(originalYieldInput.value) || 1;
            const newYield = originalYield * factor;
            desiredYieldInput.value = newYield;
            this.calculateScaledRecipe();
        }
    }
    
    addIngredientRow() {
        const container = document.getElementById('ingredients-container');
        const newRow = RecipeStorage.createIngredientRow();
        container.appendChild(newRow);
        
        // Focus on the first input of the new row
        const firstInput = newRow.querySelector('.ingredient-name');
        firstInput?.focus();
    }
    
    calculateScaledRecipe() {
        const originalYield = parseFloat(document.getElementById('original-yield')?.value) || 1;
        const desiredYield = parseFloat(document.getElementById('desired-yield')?.value) || 1;
        const scaleFactor = desiredYield / originalYield;
        
        const ingredients = this.getIngredientsFromForm();
        const scaledIngredients = ingredients.map(ingredient => {
            const scaledAmount = ingredient.amount * scaleFactor;
            return {
                ...ingredient,
                scaledAmount,
                displayAmount: UnitConverter.formatAmount(scaledAmount, ingredient.unit)
            };
        });
        
        this.displayResults(scaledIngredients, scaleFactor, originalYield, desiredYield);
    }
    
    getIngredientsFromForm() {
        const ingredients = [];
        document.querySelectorAll('.ingredient-row').forEach(row => {
            const name = row.querySelector('.ingredient-name')?.value?.trim();
            const amount = parseFloat(row.querySelector('.ingredient-amount')?.value);
            const unit = row.querySelector('.ingredient-unit')?.value;
            
            if (name && !isNaN(amount) && amount > 0 && unit) {
                ingredients.push({ name, amount, unit });
            }
        });
        return ingredients;
    }
    
    displayResults(scaledIngredients, scaleFactor, originalYield, desiredYield) {
        const resultsContainer = document.getElementById('scaled-results');
        const scaleInfo = document.getElementById('scale-info');
        
        if (!resultsContainer || !scaleInfo) return;
        
        // Display scaled ingredients
        if (scaledIngredients.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align: center; color: #718096; padding: 2rem;">Add ingredients to see scaled results</p>';
            scaleInfo.innerHTML = '';
            return;
        }
        
        resultsContainer.innerHTML = scaledIngredients.map(ingredient => `
            <div class="result-item">
                <span><strong>${ingredient.name}</strong></span>
                <span style="color: #5d5347;">${ingredient.displayAmount}</span>
            </div>
        `).join('');
        
        // Display scale information
        const scaleFactorDisplay = Math.round(scaleFactor * 100) / 100;
        const percentage = Math.round(scaleFactor * 100);
        
        scaleInfo.innerHTML = `
            <div class="scale-info">
                <strong style="font-size: 1.1rem;">Scale Factor: ${scaleFactorDisplay}x (${percentage}%)</strong>
            </div>
        `;
    }
    
    getYieldUnit(yieldAmount) {
        if (yieldAmount === 1) return 'portion';
        return 'portions';
    }
    
    saveCurrentRecipe() {
        try {
            const recipe = RecipeStorage.createRecipeFromCurrentForm();
            RecipeStorage.saveRecipe(recipe);
            this.showNotification('Recipe saved successfully!', 'success');
            window.savedRecipesManager?.renderSavedRecipes();
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }
    
    clearRecipe() {
        if (confirm('Are you sure you want to clear all ingredients?')) {
            document.getElementById('original-yield').value = '1';
            document.getElementById('desired-yield').value = '1';
            
            const container = document.getElementById('ingredients-container');
            container.innerHTML = '';
            
            // Add one empty row
            this.addIngredientRow();
            this.calculateScaledRecipe();
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #48bb78;' : ''}
            ${type === 'error' ? 'background: #f56565;' : ''}
            ${type === 'info' ? 'background: #4299e1;' : ''}
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Baker's Percentage Calculator
class BakersPercentageCalculator {
    constructor() {
        this.initializeEventListeners();
        this.updatePercentageCalculations();
    }
    
    initializeEventListeners() {
        const flourAmount = document.getElementById('flour-amount');
        flourAmount?.addEventListener('input', () => {
            this.updateActiveFlourPreset(flourAmount.value);
            this.updatePercentageCalculations();
        });
        
        // Add ingredient button for percentages
        const addPercentBtn = document.getElementById('add-percent-ingredient');
        addPercentBtn?.addEventListener('click', () => this.addPercentIngredientRow());
        
        // Flour preset buttons
        this.initializeFlourPresets();
        
        // Initial listeners
        this.addPercentageListeners();
    }
    
    initializeFlourPresets() {
        document.querySelectorAll('.flour-preset').forEach(preset => {
            preset.addEventListener('click', (e) => {
                const amount = e.target.dataset.amount;
                const flourInput = document.getElementById('flour-amount');
                
                if (flourInput) {
                    flourInput.value = amount;
                    this.updateActiveFlourPreset(amount);
                    this.updatePercentageCalculations();
                }
            });
        });
        
        // Set initial active state
        this.updateActiveFlourPreset(document.getElementById('flour-amount')?.value || '1000');
    }
    
    updateActiveFlourPreset(amount) {
        document.querySelectorAll('.flour-preset').forEach(preset => {
            preset.classList.remove('active');
            if (preset.dataset.amount === amount) {
                preset.classList.add('active');
            }
        });
    }
    
    addPercentageListeners() {
        // Handle both custom and common ingredient rows
        document.querySelectorAll('.percent-ingredient-row').forEach(row => {
            if (!row.dataset.listenersAdded) {
                row.dataset.listenersAdded = 'true';
                
                const removeBtn = row.querySelector('.remove-btn');
                removeBtn?.addEventListener('click', () => {
                    row.remove();
                    this.updatePercentageCalculations();
                });
                
                row.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', () => this.updatePercentageCalculations());
                });
            }
        });
    }
    
    addPercentIngredientRow() {
        const container = document.getElementById('percent-ingredients-container');
        const newRow = document.createElement('div');
        newRow.className = 'percent-ingredient-row compact';
        newRow.innerHTML = `
            <input type="text" placeholder="Ingredient" class="percent-name compact-input">
            <input type="number" placeholder="grams" class="gram-value compact-input" step="0.1">
            <span class="gram-symbol">g</span>
            <span class="calculated-percentage compact">0%</span>
            <button class="remove-btn compact" type="button">×</button>
        `;
        
        container.appendChild(newRow);
        this.addPercentageListeners();
        
        // Trigger initial calculation update
        this.updatePercentageCalculations();
        
        // Focus on the first input
        newRow.querySelector('.percent-name')?.focus();
    }
    
    updatePercentageCalculations() {
        const flourAmount = parseFloat(document.getElementById('flour-amount')?.value) || 1000;
        let totalWeight = flourAmount;
        let totalPercentage = 100; // Flour is always 100%
        
        document.querySelectorAll('.percent-ingredient-row').forEach(row => {
            const gramAmount = parseFloat(row.querySelector('.gram-value')?.value) || 0;
            const percentage = flourAmount > 0 ? (gramAmount / flourAmount) * 100 : 0;
            const percentageSpan = row.querySelector('.calculated-percentage');
            
            if (percentageSpan) {
                percentageSpan.textContent = `${Math.round(percentage * 10) / 10}%`;
            }
            
            totalWeight += gramAmount;
            totalPercentage += percentage;
        });
        
        // Update results
        this.displayPercentageResults(flourAmount, totalWeight, totalPercentage);
    }
    
    displayPercentageResults(flourAmount, totalWeight, totalPercentage) {
        const resultsContainer = document.getElementById('percent-results');
        if (!resultsContainer) return;
        
        // Build ingredients list
        let ingredientsHtml = `
            <div class="result-item">
                <span><strong>Flour (Base)</strong></span>
                <span style="color: #5d5347;">${flourAmount} g (100%)</span>
            </div>
        `;
        
        // Add all gram-based ingredients
        document.querySelectorAll('.percent-ingredient-row').forEach(row => {
            const name = row.querySelector('.percent-name')?.value?.trim();
            const gramAmount = parseFloat(row.querySelector('.gram-value')?.value) || 0;
            
            if (name && gramAmount > 0) {
                const percentage = flourAmount > 0 ? Math.round(((gramAmount / flourAmount) * 100) * 10) / 10 : 0;
                ingredientsHtml += `
                    <div class="result-item">
                        <span><strong>${name}</strong></span>
                        <span style="color: #5d5347;">${gramAmount} g (${percentage}%)</span>
                    </div>
                `;
            }
        });
        
        // Add summary totals
        const summaryHtml = `
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(139, 117, 93, 0.3);">
                <div class="result-item">
                    <span><strong>Total Weight</strong></span>
                    <span style="color: #5d5347;">${Math.round(totalWeight)} g (${Math.round(totalPercentage)}%)</span>
                </div>
                <div class="result-item">
                    <span><strong>Hydration Level</strong></span>
                    <span style="color: #5d5347;">${this.calculateHydration()}%</span>
                </div>
            </div>
        `;
        
        resultsContainer.innerHTML = ingredientsHtml + summaryHtml;
    }
    
    calculateHydration() {
        const flourAmount = parseFloat(document.getElementById('flour-amount')?.value) || 1000;
        let waterContent = 0;
        
        document.querySelectorAll('.percent-ingredient-row').forEach(row => {
            const name = row.querySelector('.percent-name')?.value?.toLowerCase() || '';
            const gramAmount = parseFloat(row.querySelector('.gram-value')?.value) || 0;
            
            if (name.includes('water') || name.includes('milk') || name.includes('liquid')) {
                const percentage = flourAmount > 0 ? (gramAmount / flourAmount) * 100 : 0;
                waterContent += percentage;
            }
        });
        return Math.round(waterContent);
    }
}

// Make classes available globally
window.RecipeCalculator = RecipeCalculator;
window.BakersPercentageCalculator = BakersPercentageCalculator;