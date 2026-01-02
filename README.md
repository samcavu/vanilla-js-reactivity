# vanilla-js-reactivity

A simple reactive state management system built with vanilla JavaScript and HTML. No external libraries or build tools required.

## Features

- **Reactive State Management**: Uses JavaScript Proxy to detect and respond to state changes
- **Two-way Data Binding**: Automatic synchronization between form elements and state
- **Four Form Element Types**: Input field, checkbox, select dropdown, and textarea
- **Real-time State Display**: Visual representation of the current state
- **Zero Dependencies**: Pure vanilla JavaScript and HTML

## Usage

Simply open `index.html` in a web browser or serve it with any HTTP server:

```bash
python3 -m http.server 8080
```

Then navigate to `http://localhost:8080`

## How It Works

### HTML Binding
Form elements are bound to the reactive state using `data-bind` attributes:

```html
<input type="text" data-bind="username" />
<input type="checkbox" data-bind="subscribe" />
<select data-bind="theme">...</select>
<textarea data-bind="bio"></textarea>
```

### Display Binding
Elements can display state values using `data-display` attributes:

```html
<span data-display="username"></span>
```

### JavaScript API
The reactive state is accessible via `window.reactiveState`:

```javascript
// Get state value
console.log(reactiveState.username);

// Set state value (triggers UI update)
reactiveState.username = "NewValue";

// Subscribe to changes
reactiveState.subscribe('username', (newValue, oldValue) => {
    console.log(`Username changed from ${oldValue} to ${newValue}`);
});
```

## Core Functions

- `createReactiveState(initialState)`: Creates a reactive proxy object
- `bindElementsToState(state, selector)`: Binds form elements to state
- `bindDisplayToState(state, selector)`: Binds display elements to state

## Demo

![Initial State](https://github.com/user-attachments/assets/a139a372-6838-4688-8702-d1539146682c)

![Reactive State](https://github.com/user-attachments/assets/e54fef14-20a2-452b-b38c-c91cb59d3561)
