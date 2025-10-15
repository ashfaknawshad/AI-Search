# AI Search Visualizer - Modern Edition# AI Search Visualizer - Modern Edition



An interactive educational web application for visualizing AI search algorithms with a modern, intuitive interface.An interactive educational web application for visualizing AI search algorithms with a modern, intuitive interface.



![AI Search Visualizer](https://img.shields.io/badge/AI-Search%20Visualizer-blueviolet?style=for-the-badge)![AI Search Visualizer](https://img.shields.io/badge/AI-Search%20Visualizer-blueviolet?style=for-the-badge)

![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

![Brython](https://img.shields.io/badge/Brython-3.9-blue?style=for-the-badge)![Brython](https://img.shields.io/badge/Brython-3.9-blue?style=for-the-badge)



**Live Demo:** [https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)**Live Demo:** [https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)



------



## 🎯 About## 🎯 About



This project is an enhanced version of the original [AI-Search](https://github.com/Ali-Elganzory/AI-Search) by **Ali Elganzory**. The modernized edition features:This project is an enhanced version of the original [AI-Search](https://github.com/Ali-Elganzory/AI-Search) by **Ali Elganzory**. The modernized edition features:



- 🎨 **Modern UI/UX** with glassmorphism design and smooth animations- 🎨 **Modern UI/UX** with glassmorphism design and smooth animations

- 🔍 **Infinite Canvas** with pan and zoom capabilities- 🔍 **Infinite Canvas** with pan and zoom capabilities

- 🎬 **Export Options** - PNG, PDF, and animated GIF recording- 🎬 **Export Options** - PNG, PDF, and animated GIF recording

- 🎨 **Customizable Colors** - Personalize node colors for different states- 🎨 **Customizable Colors** - Personalize node colors for different states

- ↩️ **Undo/Redo** - Full history management with keyboard shortcuts- ↩️ **Undo/Redo** - Full history management with keyboard shortcuts

- 📱 **Responsive Design** with Tailwind CSS- 📱 **Responsive Design** with Tailwind CSS

- 🎭 **Interactive Icons** with hover effects and tooltips- 🎭 **Interactive Icons** with hover effects and tooltips

- 🚀 **Real-time Visualization** of algorithm execution- 🚀 **Real-time Visualization** of algorithm execution

- 🌓 **Dark Mode** - Toggle between light and dark themes- 🌓 **Dark Mode** - Toggle between light and dark themes



------



## ✨ Features2. Install the "Live Server" extension



### 🎨 Graph Construction3. Right-click `index.html` and select "Open with Live Server"



- **Node Management**

  - Add nodes by clicking anywhere on the canvas

  - Delete nodes with the eraser tool## 📖 How to Use

  - Configure node states: source, goal, empty, visited, path

  - Set custom heuristic values for informed search algorithms### Visualization Features

  - Customizable node colors for each state

### Building Your Graph

- **Edge Management**

  - Create undirected edges between any two nodes- **Color-coded nodes**:

  - Assign custom weights to edges

  - Edit weights by clicking on edge labels1. **Add Nodes**: Click anywhere on the canvas

  - Visual edge highlighting on hover

2. **Add Edges**: Select the edge tool, then click two nodes to connect

- **Canvas Controls**

  - **Pan**: Right-click drag OR Move tool + drag empty space3. **Set Goal**: Click the flag icon, then click a node to toggle goal state

  - **Zoom**: Mouse wheel (zoom in/out)

  - **Reset View**: Maximize button in zoom controls4. **Set Weights**: Click the weight icon, then click an edge label to modify 

  - Infinite canvas with smooth transformations

5. **Set Heuristics**: Click the hash icon, then click a node to set heuristic value

### 🔍 Supported Algorithms

### Navigation

**Uninformed Search:**

- 🔵 Breadth-First Search (BFS)- **Pan**: Right-click and drag (or middle-click drag)

- 🔴 Depth-First Search (DFS)

- 📏 Depth-Limited Search- **Zoom**: Mouse wheel (or use zoom controls in bottom-left)

- 🔁 Iterative Deepening Search

- 💰 Uniform Cost Search (UCS)- **Reset View**: Click the maximize icon in zoom controls

- ↔️ Bidirectional Search

- **Step-by-step animation** with adjustable speed (500ms intervals)

**Informed Search:**

- 🎯 Greedy Best-First Search### Running Algorithms

- ⭐ A* Search

- **Real-time console logging** for debugging and learning

### 🎬 Visualization & Animation

1. Select an algorithm from the bottom panel

- **Real-time Color-coded States**:

  - 🔴 Red: Source/Start node2. Ensure at least one goal node is set (green)

  - 🟢 Green: Goal nodes

  - 🟣 Purple: Visited nodes during search3. Click "🚀 Start Search"

  - 🟠 Orange: Final solution path

  - ⚪ White: Unvisited/Empty nodes4. Watch the visualization unfold!



- **Animation Controls**

  - Smooth step-by-step visualization (500ms intervals)### Exporting Results

  - Real-time console logging for debugging

  - Automatic path highlighting when goal is found



### 🎨 Customization Features- **PNG**: Instant snapshot of current canvas state



- **Color Settings**- **PDF**: Export as PDF document

  - Customize all 5 node state colors

  - Color palette modal with live preview- **GIF**: Records animation from search start to completion (auto-saves when search finishes)

  - Instant color updates across the graph

  - Access via palette button in toolbar



- **Theme Toggle**## 🛠️ Tech Stack

  - Light/Dark mode support

  - Smooth theme transitions

  - Theme toggle in zoom controls panel (bottom-left)

- **Frontend**: HTML5, CSS3 (Tailwind CSS)

### ↩️ History Management

- **Python Integration**: Brython 3.9 (Python-to-JavaScript transpiler)

- **Undo/Redo**

  - Full state history (up to 50 states)- **Icons**: Lucide Icons

  - Keyboard shortcuts: `Ctrl+Z` (Undo), `Ctrl+Y` (Redo)

  - Preserves all graph changes (nodes, edges, weights, heuristics)- **Tooltips**: Tippy.js



### 📤 Export Options- **Canvas**: HTML5 Canvas API with transform/scale for pan/zoom1. 



- **PNG Export**- **Export Libraries**: 

  - Instant snapshot of current canvas state

  - High-quality image capture  - gif.js (GIF encoding)

  - Includes all nodes, edges, and current visualization state

  - jsPDF (PDF generation)

- **PDF Export**

  - Professional document format  - html2canvas (Canvas capture)

  - Preserves canvas dimensions and quality

  - Perfect for reports and presentations

## 📁 Project Structure

- **GIF Recording** 🎬

  - Records entire search algorithm animation

  - Click GIF button to start recording (red border appears)```

  - Run any algorithm - frames captured automatically

  - Auto-saves when search completesAI-Search/

  - Progress indicator during encoding (0% to 100%)

  - Perfect for educational demonstrations and sharing├── index.html              # Modern UI (main entry point)- Add a node by clicking where you want it to be drawn.



### 🛠️ Interactive Tools├── main.py                 # Core application logic with pan/zoom



| Tool | Description | Usage |├── SearchAgent.py          # Search algorithm implementations2. **Start a local server**- Add an edge between two nodes A and B by clicking on A then B.

|------|-------------|-------|

| **Select** | Default interaction mode | Click nodes/edges to select |├── Node.py                 # Node data structure

| **Add Node** | Create new nodes | Click anywhere on canvas |

| **Add Edge** | Connect two nodes | Click first node, then second |├── PriorityQueue.py        # Priority queue for informed searc

| **Move** | Reposition or pan | Drag nodes OR drag canvas |

| **Set Goal** | Mark goal nodes | Click nodes to toggle goal state |├── gif-recorder.js         # GIF recording module

| **Set Weight** | Edit edge costs | Click edge labels to modify |

| **Set Heuristic** | Assign h(n) values | Click nodes to set heuristic |├── styles.css              # Additional custom stylespython -m http.server 8000- Set weights and heuristics by clicking on the edge weight text and nodes respectively.

| **Eraser** | Delete elements | Click nodes to remove |

| **Help** | Quick reference | View keyboard shortcuts & guide |├── legacy/                 # Original version (preserved for reference)



---│   ├── index.html



## 🚀 Quick Start│   ├── main.py



### Option 1: GitHub Pages (Recommended)│   └── README-original.md



Visit the live demo: **[https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)**└── graphic/                # Assets and images



### Option 2: Local Development```



1. **Clone the repository**

```bash

git clone https://github.com/ashfaknawshad/AI-Search.git## 🎓 Educational Value

cd AI-Search

```

- **Students** learning AI search algorithms

2. **Start a local server**

```bash- **Educators** demonstrating algorithm behavior

python -m http.server 8000

```- **Developers** understanding pathfinding concepts



3. **Open in browser**- **Researchers** prototyping graph-based algorithms

```

http://localhost:8000/index.html

```

## 🤝 Attribution & License

### Option 3: VS Code Live Server



1. Open the project folder in VS Code### Original Project</br>

2. Install the "Live Server" extension

3. Right-click `index.html` and select "Open with Live Server"- **Author**: Ali Elganzory



---- **Repository**: [github.com/Ali-Elganzory/AI-Search](https://github.com/Ali-Elganzory/AI-Search)



## 📖 How to Use- **License**: MIT License (2021)



### Building Your Graph

### Modernization Enhancements

1. **Add Nodes**: Click the "Add Node" tool, then click anywhere on canvas

2. **Add Edges**: Click "Add Edge" tool, then click two nodes to connect- **Enhanced by**: Ashfak Nawshad

3. **Set Goal**: Click "Set Goal" tool (flag icon), then click a node to toggle goal state

4. **Set Weights**: Click "Set Weight" tool, then click edge labels to modify- **GitHub**: [@ashfaknawshad](https://github.com/ashfaknawshad)

5. **Set Heuristics**: Click "Set Heuristic" tool (hash icon), then click nodes to assign h(n) values

- **Year**: 2025

### Navigation

- **Key Additions**:

- **Pan Canvas**: Right-click and drag OR use Move tool on empty space

- **Zoom In/Out**: Scroll mouse wheel  - Modern UI/UX with Tailwind CSS and Lucide Icons

- **Reset View**: Click maximize icon in zoom controls (bottom-left)

- **Undo/Redo**: Press `Ctrl+Z` / `Ctrl+Y`  - Infinite canvas with pan/zoom functionality



### Running Algorithms  - Export features (PNG, PDF, GIF)



1. Ensure you have at least one goal node (green) set  - Improved animation and rendering system

2. Select an algorithm from the dropdown at the bottom

3. Click **"🚀 Start Search"** button  - Enhanced debugging and console logging

4. Watch the visualization unfold step-by-step!



### Recording GIF

### License

1. Click the **GIF button** in the export panel (red border appears)

2. Select and run an algorithm

3. Wait for algorithm to complete

4. GIF automatically encodes and downloads (watch progress: 0% → 100%)This project retains the original MIT License. See [LICENSE](LICENSE) file for full text.



### Customizing Colors



1. Click the **Palette button** (🎨) in the toolbar**Both the original work by Ali Elganzory and modernization enhancements are licensed under MIT.**

2. Choose colors for each node state:

   - Source Node

   - Goal Node

   - Empty Node## 🐛 Known Issues & Troubleshooting- *

   - Visited Node

   - Path Node- **Issue**: Console shows "cdn.tailwindcss.com should not be used in production"

3. Click **Apply** to update all nodes

- **Impact**: None for GitHub Pages / portfolio projects

---

- **Solution**: Ignore or switch to compiled Tailwind for large-scale production

## 🛠️ Tech Stack



- **Frontend**: HTML5, CSS3 (Tailwind CSS)- **Issue**: `from browser import...` shows yellow underlines

- **Python Integration**: Brython 3.9 (Python-to-JavaScript transpiler)

- **Icons**: Lucide Icons- **Impact**: None - these are Brython-specific imports that work in browser4. Watch the visualization unfold!

- **Tooltips**: Tippy.js

- **Canvas**: HTML5 Canvas API with transform/scale for pan/zoom- **Solution**: Warnings can be safely ignored

- **Export Libraries**: 

  - gif.js (GIF encoding with Web Workers)

  - jsPDF (PDF generation)

  - html2canvas (Canvas capture)- **Issue**: Console shows "GIF recorder not available yet"



---- **Impact**: GIF export may not work immediately on page load- **PDF**: Export as PDF document



## 📁 Project Structure- **Solution**: Wait for page to fully load before starting a search with GIF recording- **GIF**: Records animation from search start to completion (auto-saves when search finishes)



```

AI-Search/

├── index.html              # Modern UI (main entry point)## 🚀 Deployment to GitHub Pages## 🛠️ Tech Stack

├── main.py                 # Core application logic with pan/zoom

├── SearchAgent.py          # Search algorithm implementations

├── Node.py                 # Node data structure

├── PriorityQueue.py        # Priority queue for informed search1. **Push to GitHub**:- **Frontend**: HTML5, CSS3 (Tailwind CSS)

├── gif-recorder.js         # GIF recording module

├── gif.worker.js           # Web Worker for GIF encoding```bash- **Python Integration**: Brython 3.9 (Python-to-JavaScript transpiler)

├── styles.css              # Additional custom styles

├── legacy/                 # Original version (preserved for reference)git add .- **Icons**: Lucide Icons

│   ├── index.html

│   ├── main.pygit commit -m "Modernized AI Search Visualizer with proper attribution"- **Tooltips**: Tippy.js

│   └── README-original.md

└── graphic/                # Assets and imagesgit push origin main- **Canvas**: HTML5 Canvas API with transform/scale for pan/zoom

```

```- **Export Libraries**: 

---

  - gif.js (GIF encoding)

## ⌨️ Keyboard Shortcuts

2. **Enable GitHub Pages**:  - jsPDF (PDF generation)

| Shortcut | Action |

|----------|--------|   - Go to repository Settings → Pages  - html2canvas (Canvas capture)

| `Ctrl+Z` | Undo last action |

| `Ctrl+Y` | Redo last undone action |   - Source: Deploy from branch `main`

| `Right Click + Drag` | Pan canvas |

| `Mouse Wheel` | Zoom in/out |   - Folder: `/ (root)`## 📁 Project Structure



---   - Save and wait ~1 minute



## 🎓 Educational Value```



Perfect for:3. **Access your site**:AI-Search/

- **Students** learning AI search algorithms

- **Educators** demonstrating algorithm behavior in class```├── index.html              # Modern UI (main entry point)

- **Developers** understanding pathfinding concepts

- **Researchers** prototyping graph-based algorithmshttps://ashfaknawshad.github.io/AI-Search/├── main.py                 # Core application logic with pan/zoom



---```├── SearchAgent.py          # Search algorithm implementations



## 🤝 Attribution & License├── Node.py                 # Node data structure



### Original Project## 🙏 Acknowledgments├── PriorityQueue.py        # Priority queue for informed search



- **Author**: Ali Elganzory├── gif-recorder.js         # GIF recording module

- **Repository**: [github.com/Ali-Elganzory/AI-Search](https://github.com/Ali-Elganzory/AI-Search)

- **License**: MIT License (2021)- **Ali Elganzory** for the original AI-Search project and algorithm implementations├── styles.css              # Additional custom styles



### Modernization Enhancements- **Brython Team** for the Python-in-browser runtime├── legacy/                 # Original version (preserved for reference)



- **Enhanced by**: Ashfak Nawshad- **Tailwind CSS** for the utility-first CSS framework│   ├── index.html

- **GitHub**: [@ashfaknawshad](https://github.com/ashfaknawshad)

- **Year**: 2025- **Lucide Icons** for beautiful open-source icons│   ├── main.py

- **Key Additions**:

  - Modern UI/UX with Tailwind CSS and Lucide Icons- Community contributors and testers│   └── README-original.md

  - Infinite canvas with pan/zoom functionality

  - Export features (PNG, PDF, GIF with local worker)└── graphic/                # Assets and images

  - Undo/Redo with full history management

  - Customizable node colors with palette modal

  - Dark mode support

  - Enhanced Move tool for dual-purpose (node drag + canvas pan)## 🚀 Deployment to GitHub Pages

  - Improved animation and rendering system

  - Enhanced debugging and console logging1. **Push to GitHub**:

```bash

### Licensegit add .

git commit -m "Modernized AI Search Visualizer with proper attribution"

This project retains the original MIT License. See [LICENSE](LICENSE) file for full text.git push origin main

```

**Both the original work by Ali Elganzory and modernization enhancements are licensed under MIT.**

2. **Enable GitHub Pages**:

---   - Go to repository Settings → Pages

   - Source: Deploy from branch `main`

## 🐛 Known Issues & Troubleshooting   - Folder: `/ (root)`

   - Save and wait ~1 minute

- **Issue**: Console shows "cdn.tailwindcss.com should not be used in production"

  - **Impact**: None for GitHub Pages / portfolio projects3. **Access your site**:

  - **Solution**: Ignore or switch to compiled Tailwind for large-scale production```

https://[YourUsername].github.io/AI-Search/

- **Issue**: `from browser import...` shows yellow underlines in editors```

  - **Impact**: None - these are Brython-specific imports that work in browser

  - **Solution**: Warnings can be safely ignored## 🙏 Acknowledgments



---- **Ali Elganzory** for the original AI-Search project and algorithm implementations

- **Brython Team** for the Python-in-browser runtime

## 🚀 Deployment to GitHub Pages- **Tailwind CSS** for the utility-first CSS framework

- **Lucide Icons** for beautiful open-source icons

1. **Push to GitHub**:- Community contributors and testers

```bash

git add .## 📞 Contact & Contributions

git commit -m "Update AI Search Visualizer"

git push origin mainFound a bug or want to contribute? 

```- Open an issue on GitHub

- Submit a pull request

2. **Enable GitHub Pages**:- Fork and customize for your needs!

   - Go to repository Settings → Pages

   - Source: Deploy from branch `main`---

   - Folder: `/ (root)`

   - Save and wait ~1 minute**⭐ If you find this project useful, please star it on GitHub!**



3. **Access your site**:Made with ❤️ for the AI education community

```
https://[YourUsername].github.io/AI-Search/
```

---

## 🙏 Acknowledgments

- **Ali Elganzory** for the original AI-Search project and algorithm implementations
- **Brython Team** for the Python-in-browser runtime
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide Icons** for beautiful open-source icons
- **gif.js** for client-side GIF encoding
- Community contributors and testers

---

## 📞 Contact & Contributions

Found a bug or want to contribute? 
- Open an issue on [GitHub Issues](https://github.com/ashfaknawshad/AI-Search/issues)
- Submit a pull request
- Fork and customize for your needs!

---

**⭐ If you find this project useful, please star it on GitHub!**

Made with ❤️ for the AI education community
