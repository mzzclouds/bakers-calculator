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
        this.initializePrivacyModal();
        this.initializeRouting();
        
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
        
        // Add event listener for Baker's Percentage button
        const percentageBtn = document.querySelector('.percentage-link-btn');
        percentageBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            this.switchSection(section);
        });
        
        // Add event listener for Calculator button (on percentage page)
        const calculatorBtn = document.querySelector('.calculator-link-btn');
        calculatorBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.dataset.section;
            this.switchSection(section);
        });
    }
    
    switchSection(section) {
        // Update URL hash
        window.history.pushState({}, '', `#${section}`);
        
        // Navigate to the section
        this.navigateToSection(section);
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
    
    initializePrivacyModal() {
        const privacyLink = document.getElementById('privacy-policy-link');
        const modal = document.getElementById('privacy-modal');
        const closeBtn = modal.querySelector('.close');
        const privacyContent = document.getElementById('privacy-content');
        
        // Privacy policy content - you can replace this with your markdown content
        const privacyPolicyHTML = `
            <h3>Information We Collect</h3>
            <p>This application is designed with privacy in mind. We collect minimal information to provide our services:</p>
            <ul>
                <li><strong>Local Storage:</strong> We store your saved recipes and preferences locally on your device using browser local storage.</li>
                <li><strong>Usage Data:</strong> We may collect anonymous usage statistics through Google Analytics to help improve our service.</li>
                <li><strong>No Personal Information:</strong> We do not collect, store, or transmit any personal information such as names, email addresses, or contact details.</li>
            </ul>

            <h3>How We Use Information</h3>
            <p>The limited information we collect is used solely to:</p>
            <ul>
                <li>Save your recipes locally on your device</li>
                <li>Maintain your preferences and settings</li>
                <li>Analyze usage patterns to improve our calculator</li>
                <li>Ensure the proper functioning of our application</li>
            </ul>

            <h3>Data Storage and Security</h3>
            <p>Your data security is important to us:</p>
            <ul>
                <li><strong>Local Storage:</strong> All your recipes and preferences are stored locally in your browser and never transmitted to our servers.</li>
                <li><strong>No Account Required:</strong> You can use all features without creating an account or providing personal information.</li>
                <li><strong>Secure Connection:</strong> Our website uses HTTPS to ensure secure communication.</li>
            </ul>

            <h3>Third-Party Services</h3>
            <p>We use Google AdSense to display advertisements. Google may use cookies and collect data according to their privacy policy. You can learn more about Google's privacy practices at <a href="https://policies.google.com/privacy" target="_blank">https://policies.google.com/privacy</a>.</p>

            <h3>Your Control</h3>
            <p>You have full control over your data:</p>
            <ul>
                <li>Clear your browser's local storage to remove all saved recipes</li>
                <li>Use browser settings to block cookies and tracking</li>
                <li>Use ad blockers if you prefer not to see advertisements</li>
            </ul>

            <h3>Changes to This Policy</h3>
            <p>We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated effective date.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions about this privacy policy, please contact us at allmyonlineprojects@gmail.com.</p>
            
            <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
        `;
        
        // Set the privacy policy content
        privacyContent.innerHTML = privacyPolicyHTML;
        
        // Open modal when privacy link is clicked
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close modal when X is clicked
        closeBtn.addEventListener('click', () => {
            this.closePrivacyModal();
        });
        
        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePrivacyModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.closePrivacyModal();
            }
        });
    }
    
    closePrivacyModal() {
        const modal = document.getElementById('privacy-modal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }
    
    initializeRouting() {
        // Handle initial page load with URL hash
        this.handleRouteChange();
        
        // Listen for browser back/forward button events
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
        
        // Listen for hash changes (fallback)
        window.addEventListener('hashchange', () => {
            this.handleRouteChange();
        });
    }
    
    handleRouteChange() {
        // Get current hash from URL
        const hash = window.location.hash.slice(1); // Remove the '#'
        
        // Default to calculator if no hash or invalid hash
        const validSections = ['calculator', 'percentages'];
        const section = validSections.includes(hash) ? hash : 'calculator';
        
        // Navigate to the section without updating URL (to avoid infinite loop)
        this.navigateToSection(section);
    }
    
    navigateToSection(section) {
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

// Browser navigation is now handled by the routing system

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