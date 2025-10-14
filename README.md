# AI Search Visualizer - Modern Edition



An interactive educational web application for visualizing AI search algorithms with a modern, intuitive interface.



![AI Search Visualizer](https://img.shields.io/badge/AI-Search%20Visualizer-blueviolet?style=for-the-badge) An interactive educational web application for visualizing AI search algorithms with a modern, intuitive interface.Check this app at:

![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

![Brython](https://img.shields.io/badge/Brython-3.9-blue?style=for-the-badge)

https://ali-elganzory.github.io/AI-Search/



## 🎯 About AI Search Visualizer



This project is an enhanced version of the original [AI-Search](https://github.com/Ali-Elganzory/AI-Search) by **Ali Elganzory**. The modernized edition features:![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)



- 🎨 **Modern UI/UX** with glassmorphism design and smooth animations

- 🔍 **Infinite Canvas** with pan (right-click drag) and zoom (mouse wheel)

- 🖼️ **Export Options** - PNG, PDF, and animated GIF recording

- 📱 **Responsive Design** with Tailwind CSS

- 🎭 **Interactive Icons** with hover effects and tooltips## 🎯 AboutAn educational app for visualizing the different searching algorithms in the field of artificial intelligence by offering

- 🚀 **Real-time Visualization** of algorithm execution



## ✨ Features

This project is an enhanced version of the original [AI-Search](https://github.com/Ali-Elganzory/AI-Search) by **Ali Elganzory**. The modernized edition features:- Undirected / Directed graph construction.

### Graph Construction

- **Node Management**: Add, delete, and configure nodes with states (source, goal, visited, path)- Edge weights and state heuristics assignment.

- **Edge Management**: Create directed or undirected edges with custom weights

- **Heuristic Assignment**: Set heuristic values for informed search algorithms

- **Interactive Canvas**: Pan, zoom, and navigate large graphs easily


### Supported Algorithms


**Uninformed Search:**

- Breadth-First Search (BFS)- 📱 **Responsive Design** with Tailwind CSS

- Depth-First Search (DFS)

- Depth-Limited Search- 🎭 **Interactive Icons** with hover effects and tooltips- Breadth First Search

- Iterative Deepening Search

- Uniform Cost Search (UCS)- 🚀 **Real-time Visualization** of algorithm execution- Depth First Search



**Informed Search:**- Depth Limit Search

- Greedy Best-First Search

- A* Search## ✨ Features- Iterative Deepening Search



### Visualization Features- Uniform Cost Search

- **Color-coded nodes**:

  - 🔴 Red: Source node### Graph Construction- Greedy Search

  - 🟢 Green: Goal nodes

  - 🟣 Purple: Visited nodes during search

  - 🟠 Orange: Solution path

  - ⚪ White: Unvisited nodes- **Edge Management**: Create directed or undirected edges with custom weights

- **Step-by-step animation** with adjustable speed (500ms intervals)

- **Real-time console logging** for debugging and learning- **Heuristic Assignment**: Set heuristic values for informed search algorithms# App Tech Stack



## 🚀 Quick Start- **Interactive Canvas**: Pan, zoom, and navigate large graphs easily



### Option 1: GitHub Pages (Recommended)The app is built using HTML and Python as a website that can be run on any browser. To use the Web API, a Python-JavaScript transcompiler called Brython is used.

Visit the live demo: [https://ashfaknawshad.github.io/AI-Search/](https://ashfaknawshad.github.io/AI-Search/)



### Option 2: Local Development

# Source Code

1. **Clone the repository**

```bash**Uninformed Search:**

git clone https://github.com/ashfaknawshad/AI-Search.git

cd AI-Search

```



2. **Start a local server**

```bash- Depth-Limited Search# How to Run

python -m http.server 8000

```



3. **Open in browser**

```

http://localhost:8000/index.html

```



### Option 3: VS Code Live Server


1. Open the project folder in VS Code

2. Install the "Live Server" extension

3. Right-click `index.html` and select "Open with Live Server"



## 📖 How to Use

### Visualization Features

### Building Your Graph

- **Color-coded nodes**:

1. **Add Nodes**: Click anywhere on the canvas

2. **Add Edges**: Select the edge tool, then click two nodes to connect

3. **Set Goal**: Click the flag icon, then click a node to toggle goal state

4. **Set Weights**: Click the weight icon, then click an edge label to modify 

5. **Set Heuristics**: Click the hash icon, then click a node to set heuristic value

### Navigation

- **Pan**: Right-click and drag (or middle-click drag)

- **Zoom**: Mouse wheel (or use zoom controls in bottom-left)

- **Reset View**: Click the maximize icon in zoom controls

- **Step-by-step animation** with adjustable speed (500ms intervals)

### Running Algorithms

- **Real-time console logging** for debugging and learning

1. Select an algorithm from the bottom panel

2. Ensure at least one goal node is set (green)

3. Click "🚀 Start Search"

4. Watch the visualization unfold!


### Exporting Results



- **PNG**: Instant snapshot of current canvas state

- **PDF**: Export as PDF document

- **GIF**: Records animation from search start to completion (auto-saves when search finishes)



## 🛠️ Tech Stack



- **Frontend**: HTML5, CSS3 (Tailwind CSS)

- **Python Integration**: Brython 3.9 (Python-to-JavaScript transpiler)

- **Icons**: Lucide Icons

- **Tooltips**: Tippy.js

- **Canvas**: HTML5 Canvas API with transform/scale for pan/zoom1. 

- **Export Libraries**: 

  - gif.js (GIF encoding)

  - jsPDF (PDF generation)

  - html2canvas (Canvas capture)


## 📁 Project Structure


``````

AI-Search/

├── index.html              # Modern UI (main entry point)- Add a node by clicking where you want it to be drawn.

├── main.py                 # Core application logic with pan/zoom

├── SearchAgent.py          # Search algorithm implementations2. **Start a local server**- Add an edge between two nodes A and B by clicking on A then B.

├── Node.py                 # Node data structure

├── PriorityQueue.py        # Priority queue for informed searc

├── gif-recorder.js         # GIF recording module

├── styles.css              # Additional custom stylespython -m http.server 8000- Set weights and heuristics by clicking on the edge weight text and nodes respectively.

├── legacy/                 # Original version (preserved for reference)

│   ├── index.html```

│   ├── main.py

│   └── README-original.mdAn example graph is in the below figure.

└── graphic/                # Assets and images

```



## 🎓 Educational Value```![](/graphic/example_graph.jpg)



This tool is perfect for:http://localhost:8000/index.html

- **Students** learning AI search algorithms

- **Educators** demonstrating algorithm behavior```</br>

- **Developers** understanding pathfinding concepts

- **Researchers** prototyping graph-based algorithms3 – Choose a searching algorithm from the bottom and click solve. The above graph is modified (goals, weights, and heuristics) and solved using A\* is shown below.



## 🤝 Attribution & License### Option 3: VS Code Live Server</br>



### Original Project</br>

- **Author**: Ali Elganzory

- **Repository**: [github.com/Ali-Elganzory/AI-Search](https://github.com/Ali-Elganzory/AI-Search)1. Open the project folder in VS Code

- **License**: MIT License (2021)

2. Install the "Live Server" extension![](/graphic/searched_graph.jpg)

### Modernization Enhancements

- **Enhanced by**: Ashfak Nawshad3. Right-click `index.html` and select "Open with Live Server"

- **GitHub**: [@ashfaknawshad](https://github.com/ashfaknawshad)

- **Year**: 2025The agent starts to paint the visited nodes **purple** , and then, when it finds a goal, it paints the solution path with **orange** as seen in the above figure.

- **Key Additions**:

  - Modern UI/UX with Tailwind CSS and Lucide Icons## 📖 How to Use

  - Infinite canvas with pan/zoom functionality

  - Export features (PNG, PDF, GIF)### Building Your Graph

  - Improved animation and rendering system

  - Enhanced debugging and console logging1. **Add Nodes**: Click anywhere on the canvas

2. **Add Edges**: Select the edge tool, then click two nodes to connect

### License3. **Set Goal**: Click the flag icon, then click a node to toggle goal state

4. **Set Weights**: Click the weight icon, then click an edge label to modify

This project retains the original MIT License. See [LICENSE](LICENSE) file for full text.5. **Set Heuristics**: Click the hash icon, then click a node to set heuristic value



**Both the original work by Ali Elganzory and modernization enhancements are licensed under MIT.**### Navigation



## 🐛 Known Issues & Troubleshooting- **Pan**: Right-click and drag (or middle-click drag)

- **Zoom**: Mouse wheel (or use zoom controls in bottom-left)

### Tailwind CDN Warning- **Reset View**: Click the maximize icon in zoom controls

- **Issue**: Console shows "cdn.tailwindcss.com should not be used in production"

- **Impact**: None for GitHub Pages / portfolio projects### Running Algorithms

- **Solution**: Ignore or switch to compiled Tailwind for large-scale production

1. Select an algorithm from the bottom panel

### Yellow Import Warnings in VS Code2. Ensure at least one goal node is set (green)

- **Issue**: `from browser import...` shows yellow underlines3. Click "🚀 Start Search"

- **Impact**: None - these are Brython-specific imports that work in browser4. Watch the visualization unfold!

- **Solution**: Warnings can be safely ignored

### Exporting Results

### GIF Recorder Not Available

- **Issue**: Console shows "GIF recorder not available yet"- **PNG**: Instant snapshot of current canvas state

- **Impact**: GIF export may not work immediately on page load- **PDF**: Export as PDF document

- **Solution**: Wait for page to fully load before starting a search with GIF recording- **GIF**: Records animation from search start to completion (auto-saves when search finishes)



## 🚀 Deployment to GitHub Pages## 🛠️ Tech Stack



1. **Push to GitHub**:- **Frontend**: HTML5, CSS3 (Tailwind CSS)

```bash- **Python Integration**: Brython 3.9 (Python-to-JavaScript transpiler)

git add .- **Icons**: Lucide Icons

git commit -m "Modernized AI Search Visualizer with proper attribution"- **Tooltips**: Tippy.js

git push origin main- **Canvas**: HTML5 Canvas API with transform/scale for pan/zoom

```- **Export Libraries**: 

  - gif.js (GIF encoding)

2. **Enable GitHub Pages**:  - jsPDF (PDF generation)

   - Go to repository Settings → Pages  - html2canvas (Canvas capture)

   - Source: Deploy from branch `main`

   - Folder: `/ (root)`## 📁 Project Structure

   - Save and wait ~1 minute

```

3. **Access your site**:AI-Search/

```├── index.html              # Modern UI (main entry point)

https://ashfaknawshad.github.io/AI-Search/├── main.py                 # Core application logic with pan/zoom

```├── SearchAgent.py          # Search algorithm implementations

├── Node.py                 # Node data structure

## 🙏 Acknowledgments├── PriorityQueue.py        # Priority queue for informed search

├── gif-recorder.js         # GIF recording module

- **Ali Elganzory** for the original AI-Search project and algorithm implementations├── styles.css              # Additional custom styles

- **Brython Team** for the Python-in-browser runtime├── legacy/                 # Original version (preserved for reference)

- **Tailwind CSS** for the utility-first CSS framework│   ├── index.html

- **Lucide Icons** for beautiful open-source icons│   ├── main.py

- Community contributors and testers│   └── README-original.md

└── graphic/                # Assets and images

## 📞 Contact & Contributions```



Found a bug or want to contribute? ## 🎓 Educational Value

- Open an issue on GitHub

- Submit a pull requestThis tool is perfect for:

- Fork and customize for your needs!- **Students** learning AI search algorithms

- **Educators** demonstrating algorithm behavior

---- **Developers** understanding pathfinding concepts

- **Researchers** prototyping graph-based algorithms

**⭐ If you find this project useful, please star it on GitHub!**

## 🤝 Attribution & License

Made with ❤️ for the AI education community

### Original Project
- **Author**: Ali Elganzory
- **Repository**: [github.com/Ali-Elganzory/AI-Search](https://github.com/Ali-Elganzory/AI-Search)
- **License**: MIT License (2021)

### Modernization Enhancements
- **Enhancements by**: [Your Name/Username]
- **Year**: 2025
- **Key Additions**:
  - Modern UI/UX with Tailwind CSS and Lucide Icons
  - Infinite canvas with pan/zoom functionality
  - Export features (PNG, PDF, GIF)
  - Improved animation and rendering system
  - Enhanced debugging and console logging

### License

This project retains the original MIT License. See [LICENSE](LICENSE) file for full text.

**Both the original work by Ali Elganzory and modernization enhancements are licensed under MIT.**

## 🐛 Known Issues & Troubleshooting

### Tailwind CDN Warning
- **Issue**: Console shows "cdn.tailwindcss.com should not be used in production"
- **Impact**: None for GitHub Pages / portfolio projects
- **Solution**: Ignore or switch to compiled Tailwind for large-scale production

### Yellow Import Warnings in VS Code
- **Issue**: `from browser import...` shows yellow underlines
- **Impact**: None - these are Brython-specific imports that work in browser
- **Solution**: Warnings can be safely ignored

### GIF Recorder Not Available
- **Issue**: Console shows "GIF recorder not available yet"
- **Impact**: GIF export may not work immediately on page load
- **Solution**: Wait for page to fully load before starting a search with GIF recording

## 🚀 Deployment to GitHub Pages

1. **Push to GitHub**:
```bash
git add .
git commit -m "Modernized AI Search Visualizer with proper attribution"
git push origin main
```

2. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Save and wait ~1 minute

3. **Access your site**:
```
https://[YourUsername].github.io/AI-Search/
```

## 🙏 Acknowledgments

- **Ali Elganzory** for the original AI-Search project and algorithm implementations
- **Brython Team** for the Python-in-browser runtime
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide Icons** for beautiful open-source icons
- Community contributors and testers

## 📞 Contact & Contributions

Found a bug or want to contribute? 
- Open an issue on GitHub
- Submit a pull request
- Fork and customize for your needs!

---

**⭐ If you find this project useful, please star it on GitHub!**

Made with ❤️ for the AI education community
