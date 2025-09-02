// Local storage management for saved recipes

class RecipeStorage {
    static STORAGE_KEY = 'bakerCalculatorRecipes';
    
    static saveRecipe(recipe) {
        const recipes = this.getAllRecipes();
        const existingIndex = recipes.findIndex(r => r.name === recipe.name);
        
        if (existingIndex >= 0) {
            recipes[existingIndex] = { ...recipe, lastUsed: new Date().toISOString() };
        } else {
            recipes.push({ ...recipe, lastUsed: new Date().toISOString() });
        }
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
        return true;
    }
    
    static getAllRecipes() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading recipes:', error);
            return [];
        }
    }
    
    static deleteRecipe(recipeName) {
        const recipes = this.getAllRecipes();
        const filtered = recipes.filter(r => r.name !== recipeName);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }
    
    static getRecipe(recipeName) {
        const recipes = this.getAllRecipes();
        return recipes.find(r => r.name === recipeName);
    }
    
    static formatLastUsed(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            if (diffInHours < 1) return 'Just now';
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 168) { // 7 days
            const days = Math.floor(diffInHours / 24);
            return days === 1 ? '1 day ago' : `${days} days ago`;
        } else if (diffInHours < 720) { // 30 days
            const weeks = Math.floor(diffInHours / 168);
            return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    static createRecipeFromCurrentForm() {
        const originalYield = parseFloat(document.getElementById('original-yield').value) || 1;
        const desiredYield = parseFloat(document.getElementById('desired-yield').value) || 1;
        
        const ingredients = [];
        document.querySelectorAll('.ingredient-row').forEach(row => {
            const name = row.querySelector('.ingredient-name')?.value?.trim();
            const amount = parseFloat(row.querySelector('.ingredient-amount')?.value);
            const unit = row.querySelector('.ingredient-unit')?.value;
            
            if (name && amount && unit) {
                ingredients.push({ name, amount, unit });
            }
        });
        
        if (ingredients.length === 0) {
            throw new Error('No ingredients found');
        }
        
        // Generate a name if not provided
        const mainIngredient = ingredients[0]?.name || 'Recipe';
        const recipeName = prompt(`Enter a name for this recipe:`, mainIngredient + ' Recipe');
        
        if (!recipeName) {
            throw new Error('Recipe name is required');
        }
        
        return {
            name: recipeName.trim(),
            originalYield,
            desiredYield,
            ingredients,
            createdAt: new Date().toISOString()
        };
    }
    
    static loadRecipeIntoForm(recipe) {
        // Set yields
        document.getElementById('original-yield').value = recipe.originalYield;
        document.getElementById('desired-yield').value = recipe.desiredYield;
        
        // Clear existing ingredients
        const container = document.getElementById('ingredients-container');
        container.innerHTML = '';
        
        // Add recipe ingredients
        recipe.ingredients.forEach((ingredient, index) => {
            const row = this.createIngredientRow(ingredient, index === 0);
            container.appendChild(row);
        });
        
        // Update scale factor to trigger results recalculation
        window.recipeCalculator?.calculateScaledRecipe();
    }
    
    static createIngredientRow(ingredient = {}, isFirstRow = false) {
        const row = document.createElement('div');
        row.className = 'ingredient-row';
        
        // Check if this should be the first row (with labels)
        const container = document.getElementById('ingredients-container');
        const shouldShowLabels = isFirstRow || (container && container.children.length === 0);
        
        row.innerHTML = `
            <div class="form-group">
                ${shouldShowLabels ? '<label>Ingredient</label>' : ''}
                <input type="text" class="ingredient-name" value="${ingredient.name || ''}" placeholder="Enter ingredient name">
            </div>
            <div class="form-group">
                ${shouldShowLabels ? '<label>Amount</label>' : ''}
                <input type="number" class="ingredient-amount" value="${ingredient.amount || ''}" step="0.1" placeholder="Amount">
            </div>
            <div class="form-group">
                ${shouldShowLabels ? '<label>Unit</label>' : ''}
                <select class="ingredient-unit">
                    <option value="grams" ${ingredient.unit === 'grams' ? 'selected' : ''}>grams</option>
                    <option value="cups" ${ingredient.unit === 'cups' ? 'selected' : ''}>cups</option>
                    <option value="ounces" ${ingredient.unit === 'ounces' ? 'selected' : ''}>ounces</option>
                    <option value="pounds" ${ingredient.unit === 'pounds' ? 'selected' : ''}>pounds</option>
                    <option value="milliliters" ${ingredient.unit === 'milliliters' ? 'selected' : ''}>milliliters</option>
                    <option value="teaspoons" ${ingredient.unit === 'teaspoons' ? 'selected' : ''}>teaspoons</option>
                    <option value="tablespoons" ${ingredient.unit === 'tablespoons' ? 'selected' : ''}>tablespoons</option>
                    <option value="pieces" ${ingredient.unit === 'pieces' ? 'selected' : ''}>pieces</option>
                </select>
            </div>
            <button class="remove-btn" type="button">×</button>
        `;
        
        // Add remove functionality
        const removeBtn = row.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            row.remove();
            window.recipeCalculator?.calculateScaledRecipe();
        });
        
        // Add input listeners for real-time updates
        const nameInput = row.querySelector('.ingredient-name');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                window.recipeCalculator?.handleIngredientNameChange(e.target, row);
                window.recipeCalculator?.calculateScaledRecipe();
            });
            
            // Also listen for blur to catch paste operations
            nameInput.addEventListener('blur', (e) => {
                window.recipeCalculator?.handleIngredientNameChange(e.target, row);
            });
        }
        
        // Add unit select change listener to track user modifications
        const unitSelect = row.querySelector('.ingredient-unit');
        if (unitSelect) {
            unitSelect.addEventListener('change', function() {
                this.dataset.userModified = 'true';
            });
        }
        
        // Other input listeners
        row.querySelectorAll('input:not(.ingredient-name), select:not(.ingredient-unit)').forEach(input => {
            input.addEventListener('input', () => {
                window.recipeCalculator?.calculateScaledRecipe();
            });
        });
        
        return row;
    }
}