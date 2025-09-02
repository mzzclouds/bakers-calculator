// Main application controller

class BakersCalculatorApp {
    constructor() {
        this.currentSection = 'calculator';
        this.recipeCalculator = null;
        this.bakersPercentageCalculator = null;
        this.quickConverter = null;
        this.savedRecipesManager = null;
        
        this.initializeApp();
    }
    
    initializeApp() {
        // Initialize all components
        this.initializeNavigation();
        this.initializeCalculators();
        this.initializeConverters();
        this.initializeSavedRecipes();
        this.initializeBakingTips();
        
        // Make instances available globally for other modules
        window.recipeCalculator = this.recipeCalculator;
        window.savedRecipesManager = this.savedRecipesManager;
        
        console.log('Baker\'s Calculator App initialized successfully');
    }
    
    initializeNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Make logo clickable to go back to home/calculator
        const logo = document.getElementById('logo');
        logo?.addEventListener('click', () => {
            this.switchSection('calculator');
        });
    }
    
    switchSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('.main-content').forEach(content => {
            content.style.display = 'none';
        });
        
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.style.display = section === 'calculator' ? 'grid' : 'block';
        }
        
        this.currentSection = section;
        
        // Initialize section-specific functionality
        if (section === 'percentages' && !this.bakersPercentageCalculator) {
            this.bakersPercentageCalculator = new window.BakersPercentageCalculator();
        }
    }
    
    initializeCalculators() {
        // Main recipe calculator
        this.recipeCalculator = new window.RecipeCalculator();
    }
    
    initializeConverters() {
        this.quickConverter = new QuickConverter();
    }
    
    initializeSavedRecipes() {
        this.savedRecipesManager = new SavedRecipesManager();
    }
    
    initializeBakingTips() {
        const bakingTipsHeader = document.querySelector('.baking-tips-header');
        if (bakingTipsHeader) {
            bakingTipsHeader.addEventListener('click', () => {
                this.toggleBakingTips();
            });
        }
    }
    
    toggleBakingTips() {
        const section = document.querySelector('.baking-tips-section');
        const content = document.querySelector('.baking-tips-content');
        
        if (!section || !content) return;
        
        const isExpanded = section.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            section.classList.remove('expanded');
            // Reset max-height after animation
            setTimeout(() => {
                if (!section.classList.contains('expanded')) {
                    content.style.maxHeight = '0';
                }
            }, 300);
        } else {
            // Expand
            section.classList.add('expanded');
            // Set max-height to actual content height for smooth animation
            const contentHeight = content.scrollHeight;
            content.style.maxHeight = contentHeight + 'px';
        }
    }
}

// Quick conversion functionality
class QuickConverter {
    constructor() {
        this.initializeEventListeners();
        this.performWeightConversion(); // Initial conversion
        this.performVolumeConversion(); // Initial conversion
    }
    
    initializeEventListeners() {
        // Weight converter elements
        const weightBtn = document.getElementById('weight-convert-btn');
        const weightInput = document.getElementById('weight-input');
        const weightFrom = document.getElementById('weight-from');
        const weightTo = document.getElementById('weight-to');
        
        // Volume converter elements
        const volumeBtn = document.getElementById('volume-convert-btn');
        const volumeInput = document.getElementById('volume-input');
        const volumeFrom = document.getElementById('volume-from');
        const volumeTo = document.getElementById('volume-to');
        
        // Weight converter listeners
        if (weightBtn) weightBtn.addEventListener('click', () => this.performWeightConversion());
        if (weightInput) weightInput.addEventListener('input', () => this.performWeightConversion());
        if (weightFrom) weightFrom.addEventListener('change', () => this.performWeightConversion());
        if (weightTo) weightTo.addEventListener('change', () => this.performWeightConversion());
        
        // Volume converter listeners
        if (volumeBtn) volumeBtn.addEventListener('click', () => this.performVolumeConversion());
        if (volumeInput) volumeInput.addEventListener('input', () => this.performVolumeConversion());
        if (volumeFrom) volumeFrom.addEventListener('change', () => this.performVolumeConversion());
        if (volumeTo) volumeTo.addEventListener('change', () => this.performVolumeConversion());
    }
    
    performWeightConversion() {
        const amount = parseFloat(document.getElementById('weight-input')?.value) || 0;
        const fromUnit = document.getElementById('weight-from')?.value;
        const toUnit = document.getElementById('weight-to')?.value;
        const resultInput = document.getElementById('weight-result');
        
        this.performConversion(amount, fromUnit, toUnit, resultInput, 'weight');
    }
    
    performVolumeConversion() {
        const amount = parseFloat(document.getElementById('volume-input')?.value) || 0;
        const fromUnit = document.getElementById('volume-from')?.value;
        const toUnit = document.getElementById('volume-to')?.value;
        const resultInput = document.getElementById('volume-result');
        
        this.performConversion(amount, fromUnit, toUnit, resultInput, 'volume');
    }
    
    performConversion(amount, fromUnit, toUnit, resultInput, type) {
        if (!resultInput || !fromUnit || !toUnit) return;
        
        // Handle zero or empty input
        if (amount === 0) {
            resultInput.value = '0';
            return;
        }
        
        try {
            const result = window.UnitConverter.convert(amount, fromUnit, toUnit);
            // Format result nicely - more decimal places for small numbers
            if (result < 1) {
                resultInput.value = Math.round(result * 1000) / 1000;
            } else if (result < 100) {
                resultInput.value = Math.round(result * 100) / 100;
            } else {
                resultInput.value = Math.round(result);
            }
            
            // Update result input styling to show success
            resultInput.style.color = '#5d5347';
        } catch (error) {
            resultInput.value = 'Error';
            resultInput.style.color = '#e53e3e';
            console.warn(`${type} conversion error:`, error.message);
        }
    }
}

// Saved recipes management
class SavedRecipesManager {
    constructor() {
        this.renderSavedRecipes();
    }
    
    renderSavedRecipes() {
        const container = document.getElementById('saved-recipes-list');
        const noRecipesMessage = document.getElementById('no-recipes');
        
        if (!container) return;
        
        const recipes = RecipeStorage.getAllRecipes();
        
        if (recipes.length === 0) {
            container.innerHTML = '';
            if (noRecipesMessage) noRecipesMessage.style.display = 'block';
            return;
        }
        
        if (noRecipesMessage) noRecipesMessage.style.display = 'none';
        
        // Sort by last used (most recent first)
        recipes.sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed));
        
        container.innerHTML = recipes.map(recipe => `
            <div class="saved-recipe-item" data-recipe="${recipe.name}">
                <div class="recipe-name">${recipe.name}</div>
                <div class="recipe-meta">
                    <span>Last used: ${RecipeStorage.formatLastUsed(recipe.lastUsed)}</span>
                    <button class="delete-recipe" data-recipe="${recipe.name}">Delete</button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.saved-recipe-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-recipe')) return;
                const recipeName = item.dataset.recipe;
                this.loadRecipe(recipeName);
            });
        });
        
        container.querySelectorAll('.delete-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const recipeName = btn.dataset.recipe;
                this.deleteRecipe(recipeName);
            });
        });
    }
    
    loadRecipe(recipeName) {
        const recipe = RecipeStorage.getRecipe(recipeName);
        if (recipe) {
            // Switch to calculator section if not already there
            if (window.app?.currentSection !== 'calculator') {
                window.app.switchSection('calculator');
            }
            
            RecipeStorage.loadRecipeIntoForm(recipe);
            
            // Update last used timestamp
            RecipeStorage.saveRecipe(recipe);
            this.renderSavedRecipes();
            
            // Show success message
            window.recipeCalculator?.showNotification(`Loaded recipe: ${recipe.name}`, 'success');
        }
    }
    
    deleteRecipe(recipeName) {
        if (confirm(`Are you sure you want to delete "${recipeName}"?`)) {
            RecipeStorage.deleteRecipe(recipeName);
            this.renderSavedRecipes();
            window.recipeCalculator?.showNotification(`Deleted recipe: ${recipeName}`, 'info');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BakersCalculatorApp();
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    // Could implement URL-based navigation here if needed
});

// Utility functions for global use
window.BakersUtils = {
    formatNumber: (num, decimals = 2) => {
        return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },
    
    validatePositiveNumber: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};