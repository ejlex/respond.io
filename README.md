# Respond.io Interview Assessment - Flow Diagram Editor

A powerful, interactive flow diagram editor built with Vue 3, Vite, and Vue Flow. This application allows users to create, manage, and visualize complex workflows with a focus on usability, accessibility, and performance.

## 🚀 Features

- **Interactive Canvas**: Drag and drop nodes, pan, and zoom the canvas.
- **Custom Node Types**: Specialized nodes for different workflow actions:
  - **Trigger**: Starting point of a flow.
  - **DateTime**: Time-based logic.
  - **SendMessage**: Messaging actions.
  - **AddComment**: Annotation and comments.
- **State Management**: Robust state handling using **Pinia**, featuring:
  - **Undo/Redo**: Full history stack for nodes and edges.
  - **Data Persistence**: Initial state loading and restoration.
- **Accessibility**: Comprehensive keyboard navigation support:
  - `Tab` to cycle through nodes.
  - `Arrow Keys` to move selected nodes.
  - `Enter` to view node details.
  - `Backspace`/`Delete` to remove nodes.
- **Node & Edge Management**:
  - Add new nodes via a drag-and-drop sidebar.
  - Connect nodes with smooth edges.
  - Prevent duplicate connections.
  - Delete selected nodes and edges.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Script Setup)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Diagram Engine**: [Vue Flow](https://vueflow.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [PrimeVue](https://primevue.org/)
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)

## 📦 Setup & Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Run the development server**:

    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 🏗️ Design Decisions

### State Management with Pinia

We chose **Pinia** as the centralized store to manage the application's state (`src/stores/canvas.js`).

- **Why?** The application requires complex interactions between the canvas, the sidebar (NodeCreator), and the details panel. A global store avoids prop-drilling and makes implementing features like **Undo/Redo** significantly cleaner by centralizing the source of truth for `nodes` and `edges`.
- **History Stack**: The store maintains a history stack of the entire graph state, allowing for reliable undo/redo operations for both structural changes (add/remove) and positional changes.

### Vue Flow for Diagramming

**@vue-flow/core** was selected as the underlying engine.

- **Why?** It provides a highly performant and customizable foundation for node-based interfaces in Vue. It handles the heavy lifting of coordinate systems, zooming, and panning, allowing us to focus on custom node logic and business rules.

### Accessibility First

A key focus was ensuring the canvas is accessible.

- **Implementation**: We implemented custom key bindings in the `Canvas` component to intercept keyboard events. This ensures that power users and those relying on assistive technologies can navigate and manipulate the graph effectively without relying solely on a mouse.

### Component Structure

- **`Canvas.vue`**: The main orchestrator. It initializes the Vue Flow instance and binds it to the Pinia store.
- **`ControlPanel.vue`**: The floating panel for node modifications including adding new nodes, deleting nodes, and resetting nodes to initial state with build-in undo/redo history.
- **`NodeDrawer.vue`**: A side panel for editing the properties of a selected node.
- **`src/components/node/`**: Contains the implementation of custom node types, keeping the visual logic for each node isolated.

## 📂 Project Structure

```
src/
├── components/
│   ├── details/        # Custom drawer details components (Trigger, DateTime, etc.)
│   ├── node/           # Custom node components (Trigger, DateTime, etc.)
│   ├── Canvas.vue      # Main diagram canvas wrapper
│   ├── ControlPanel.vue # Sidebar for adding new nodes
│   └── NodeDrawer.vue  # Edit panel for node details
├── stores/
│   └── canvas.js       # Pinia store for graph state & history
├── App.vue             # Root component
└── main.js             # App entry point
```
