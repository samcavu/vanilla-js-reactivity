// Reactive State Management System
// A simple reactivity implementation using Proxy and observers

/**
 * Creates a reactive state object that notifies subscribers when properties change
 * @param {Object} initialState - The initial state object
 * @returns {Proxy} A reactive proxy that triggers updates on changes
 */
function createReactiveState(initialState) {
    const subscribers = {};
    
    // Create a proxy to intercept property changes
    const state = new Proxy(initialState, {
        set(target, property, value) {
            const oldValue = target[property];
            
            // Only trigger updates if the value actually changed
            if (oldValue !== value) {
                target[property] = value;
                
                // Notify all subscribers for this property
                if (subscribers[property]) {
                    subscribers[property].forEach(callback => callback(value, oldValue));
                }
                
                // Notify wildcard subscribers (listening to all changes)
                if (subscribers['*']) {
                    subscribers['*'].forEach(callback => callback(property, value, oldValue));
                }
            }
            
            return true;
        },
        
        get(target, property) {
            return target[property];
        }
    });
    
    /**
     * Subscribe to changes on a specific property or all properties
     * @param {string} property - Property name to watch, or '*' for all properties
     * @param {Function} callback - Function to call when property changes
     * @returns {Function} Unsubscribe function
     */
    state.subscribe = function(property, callback) {
        if (!subscribers[property]) {
            subscribers[property] = [];
        }
        subscribers[property].push(callback);
        
        // Return unsubscribe function
        return function unsubscribe() {
            const index = subscribers[property].indexOf(callback);
            if (index > -1) {
                subscribers[property].splice(index, 1);
            }
        };
    };
    
    /**
     * Get all subscribers (for debugging)
     */
    state.getSubscribers = function() {
        return subscribers;
    };
    
    return state;
}

/**
 * Binds form elements to reactive state using data-bind attributes
 * @param {Proxy} state - The reactive state object
 * @param {string} selector - CSS selector for the container (default: document)
 */
function bindElementsToState(state, selector = 'body') {
    const container = document.querySelector(selector);
    if (!container) {
        console.error('Container not found:', selector);
        return;
    }
    
    // Find all elements with data-bind attribute
    const boundElements = container.querySelectorAll('[data-bind]');
    
    boundElements.forEach(element => {
        const propertyName = element.getAttribute('data-bind');
        
        if (!propertyName) return;
        
        // Initialize state property if it doesn't exist
        if (!(propertyName in state)) {
            if (element.type === 'checkbox') {
                state[propertyName] = element.checked;
            } else {
                state[propertyName] = element.value;
            }
        } else {
            // Set initial element value from state
            if (element.type === 'checkbox') {
                element.checked = state[propertyName];
            } else {
                element.value = state[propertyName];
            }
        }
        
        // Listen to changes on the element and update state
        const eventType = element.type === 'checkbox' ? 'change' : 'input';
        element.addEventListener(eventType, (e) => {
            if (element.type === 'checkbox') {
                state[propertyName] = e.target.checked;
            } else {
                state[propertyName] = e.target.value;
            }
        });
        
        // Subscribe to state changes and update element
        state.subscribe(propertyName, (newValue) => {
            if (element.type === 'checkbox') {
                if (element.checked !== newValue) {
                    element.checked = newValue;
                }
            } else {
                if (element.value !== newValue) {
                    element.value = newValue;
                }
            }
        });
    });
}

/**
 * Binds display elements to reactive state using data-display attributes
 * @param {Proxy} state - The reactive state object
 * @param {string} selector - CSS selector for the container (default: document)
 */
function bindDisplayToState(state, selector = 'body') {
    const container = document.querySelector(selector);
    if (!container) {
        console.error('Container not found:', selector);
        return;
    }
    
    // Find all elements with data-display attribute
    const displayElements = container.querySelectorAll('[data-display]');
    
    displayElements.forEach(element => {
        const propertyName = element.getAttribute('data-display');
        
        if (!propertyName) return;
        
        // Initialize display with current state value
        updateDisplay(element, state[propertyName]);
        
        // Subscribe to state changes and update display
        state.subscribe(propertyName, (newValue) => {
            updateDisplay(element, newValue);
        });
    });
    
    function updateDisplay(element, value) {
        // Format the value for display
        let displayValue;
        if (typeof value === 'boolean') {
            displayValue = value.toString();
        } else if (value === '') {
            displayValue = '""';
        } else {
            displayValue = JSON.stringify(value);
        }
        element.textContent = displayValue;
    }
}

/**
 * Initialize the reactive system
 * This is called automatically when the DOM is ready
 */
function initReactiveSystem() {
    // Create reactive state with initial values
    const state = createReactiveState({
        username: '',
        subscribe: false,
        theme: '',
        bio: ''
    });
    
    // Bind form elements to state
    bindElementsToState(state);
    
    // Bind display elements to state
    bindDisplayToState(state);
    
    // Make state available globally for debugging
    window.reactiveState = state;
    
    console.log('Reactive system initialized!');
    console.log('Access state via window.reactiveState');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactiveSystem);
} else {
    initReactiveSystem();
}
