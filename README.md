# AI Search Visualizer - Modern Edition

An interactive educational web application for visualizing AI search algorithms with a modern, intuitive interface.

![AI Search Visualizer](https://img.shields.io/badge/AI-Search%20Visualizer-blueviolet?style=for-the-badge)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)
![Brython](https://img.shields.io/badge/Brython-3.9-blue?style=for-the-badge)

**Live Demo:** [https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)

---

## 🎯 About

This project is an enhanced version of the original [AI-Search](https://github.com/Ali-Elganzory/AI-Search) by **Ali Elganzory**. The modernized edition features a modern UI/UX, infinite canvas, export options, and much more to provide an intuitive and powerful learning experience.

## ✨ Features

- 🎨 **Modern UI/UX**: A sleek interface with glassmorphism design and smooth animations.
- 🔍 **Infinite Canvas**: Pan and zoom capabilities for unlimited workspace.
- 🎬 **Export Options**: Export your creations as PNG, PDF, or record an animated GIF of the search process.
- 🎨 **Customizable Colors**: Personalize the colors for different node states (source, goal, visited, etc.).
- ↩️ **Undo/Redo**: Full history management with keyboard shortcuts (Ctrl+Z, Ctrl+Y).
- 📱 **Responsive Design**: A fully responsive layout built with Tailwind CSS.
- 🎭 **Interactive Icons**: Engaging icons with hover effects and helpful tooltips.
- 🚀 **Real-time Visualization**: Watch the search algorithms execute in real-time.
- 🌓 **Dark Mode**: Seamlessly toggle between light and dark themes.

---

## 🔍 Supported Algorithms

### Uninformed Search:
- 🔵 Breadth-First Search (BFS)
- 🔴 Depth-First Search (DFS)
- 📏 Depth-Limited Search
- 🔁 Iterative Deepening Search
- 💰 Uniform Cost Search (UCS)
- ↔️ Bidirectional Search

### Informed Search:
- 🎯 Greedy Best-First Search
- ⭐ A* Search

---

## 📖 How to Use

### 🎨 Graph Construction

- **Node Management**: Add nodes by clicking on the canvas. Use the eraser tool to delete them.
- **Edge Management**: Create and manage undirected edges between nodes, with customizable weights.
- **Node States**: Configure nodes as the source, goal, empty, visited, or part of the final path.
- **Heuristics**: Set custom heuristic values for informed search algorithms.

### NAVIGATION

- **Pan**: Right-click and drag, or use the move tool.
- **Zoom**: Use the mouse wheel or the on-screen zoom controls.
- **Reset View**: Click the maximize icon in the zoom controls to reset the view.

### Running Algorithms

1. Select an algorithm from the bottom panel.
2. Ensure at least one goal node is set (green).
3. Click "🚀 Start Search" to begin the visualization.

### Exporting Results

- **PNG**: Get an instant snapshot of the current canvas.
- **PDF**: Export the current view as a PDF document.
- **GIF**: Record the entire search animation from start to finish.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS)
- **Python Integration**: Brython 3.9 (a Python-to-JavaScript transpiler)
- **Icons**: Lucide Icons
- **Tooltips**: Tippy.js
- **Canvas**: HTML5 Canvas API for pan and zoom functionality.
- **Export Libraries**:
    - `gif.js` for GIF encoding
    - `jsPDF` for PDF generation
    - `html2canvas` for capturing the canvas

---

## 📁 Project Structure

AI-Search/
├── index.html # Modern UI (main entry point)
├── main.py # Core application logic with pan/zoom
├── SearchAgent.py # Search algorithm implementations
├── Node.py # Node data structure
├── PriorityQueue.py # Priority queue for informed search
├── gif-recorder.js # GIF recording module
├── gif.worker.js # Web Worker for GIF encoding
├── styles.css # Additional custom styles
├── legacy/ # Original version (preserved for reference)
│ ├── index.html
│ ├── main.py
│ └── README-original.md
└── graphic/ # Assets and images


---

## 🚀 Quick Start

### Option 1: GitHub Pages (Recommended)

Visit the live demo: **[https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)**

### Option 2: Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/ashfaknawshad/AI-Search.git
    cd AI-Search
    ```
2.  **Start a local server**:
    ```bash
    python -m http.server 8000
    ```
3.  **Open in your browser**:
    `http://localhost:8000`

### Option 3: VS Code Live Server

1.  Open the project folder in VS Code.
2.  Install the "Live Server" extension.
3.  Right-click `index.html` and select "Open with Live Server".

---

## 🎓 Educational Value

This tool is perfect for:
- **Students** who are learning AI search algorithms.
- **Educators** who want to demonstrate algorithm behavior in the classroom.
- **Developers** who are interested in pathfinding concepts.
- **Researchers** who need to prototype graph-based algorithms.

---

## 🤝 Attribution & License

### Original Project
- **Author**: Ali Elganzory
- **Repository**: [github.com/Ali-Elganzory/AI-Search](https://github.com/Ali-Elganzory/AI-Search)
- **License**: MIT License (2021)

### Modernization Enhancements
- **Enhanced by**: Ashfak Nawshad
- **GitHub**: [@ashfaknawshad](https://github.com/ashfaknawshad)
- **Year**: 2025

This project retains the original MIT License. Both the original work by Ali Elganzory and the modernization enhancements are licensed under the **MIT License**.

---

## 🙏 Acknowledgments

- **Ali Elganzory** for the original AI-Search project and its algorithm implementations.
- The **Brython Team** for making Python available in the browser.
- **Tailwind CSS** for its utility-first CSS framework.
- **Lucide Icons** for the beautiful and open-source icons.
- Community contributors and testers.

---

## 📞 Contact & Contributions

Found a bug or have an idea?
- Open an issue on [GitHub](https://github.com/ashfaknawshad/AI-Search/issues).
- Submit a pull request.
- Fork the repository and customize it for your own needs!

---

**⭐ If you find this project useful, please consider starring it on GitHub!**

Made with ❤️ for the AI education community.