# 🎯 Understanding Graph Types & Search Algorithms

## 🔀 Graph Types Explained

### **Undirected Graph** (Default)
- Edges work **BOTH WAYS**
- If you connect Node A → Node B, you can travel:
  - A → B ✅
  - B → A ✅
- **Real-world example**: Roads between cities (you can go both directions)
- **Use case**: When relationships are symmetric

**Visual:**
```
  1 ←→ 2
  ↕    ↕
  3 ←→ 4
```

### **Directed Graph**
- Edges work **ONE WAY** (with arrow)
- If you connect Node A → Node B, you can only travel:
  - A → B ✅
  - B → A ❌ (unless you add separate edge)
- **Real-world example**: One-way streets, web page links
- **Use case**: When relationships are asymmetric

**Visual:**
```
  1 → 2
  ↓   ↓
  3 → 4
```

---

## 🚀 How to Use the Visualizer

### Step-by-Step Tutorial

#### 1️⃣ **Build Your Graph**

**Add Nodes:**
1. Click "Add Node" tool (first icon, already selected)
2. Click anywhere on canvas to place nodes
3. Add at least 3-4 nodes

**Connect Nodes:**
1. Click "Add Edge" tool (second icon)
2. Click on first node (it highlights red)
3. Click on second node (edge appears)
4. Repeat to connect more nodes

**Set a Goal:**
1. Click "Toggle Goal" tool (flag icon)
2. Click on any node (NOT the red source node)
3. Node turns green = goal!

#### 2️⃣ **Configure Weights** (Optional)

- Click "Set Weight" tool (scale icon)
- Click on the number between two nodes
- Enter a weight (default is 1)
- Higher weights = longer/costier paths

#### 3️⃣ **Set Heuristics** (For A* and Greedy)

- Click "Set Heuristic" tool (# icon)
- Click on any non-goal node
- Enter heuristic value (estimated distance to goal)
- Lower = closer to goal

#### 4️⃣ **Run Algorithm**

1. Select an algorithm from bottom panel
2. Click "🚀 Start Search"
3. Watch the visualization:
   - **Purple nodes** = Visited
   - **Orange path** = Solution found!

---

## 🧠 Algorithm Quick Guide

### **Uninformed Search** (Don't use heuristics)

| Algorithm | How It Works | Best For |
|-----------|--------------|----------|
| **Breadth First** | Explores level by level | Shortest path (unweighted) |
| **Depth First** | Goes deep first, then backtracks | Exploring all paths |
| **Depth Limit** | Depth First with max depth (3) | Avoiding infinite loops |
| **Iterative Deepening** | Tries increasing depths | Optimal with depth control |
| **Uniform Cost** | Expands lowest cost first | Shortest path (weighted) |

### **Informed Search** (Use heuristics)

| Algorithm | How It Works | Best For |
|-----------|--------------|----------|
| **Greedy** | Always moves toward lowest h(n) | Fast (not always optimal) |
| **A*** | Uses f(n) = g(n) + h(n) | Optimal shortest path |

---

## 🎬 Example Scenarios

### Scenario 1: Simple Path Finding
```
Goal: Find path from node 0 to node 3

Graph:
  0 --- 1
  |     |
  2 --- 3 (goal)

1. Add 4 nodes in a square
2. Connect them: 0→1, 0→2, 1→3, 2→3
3. Mark node 3 as goal (green)
4. Select "Breadth First"
5. Click "Start Search"

Result: Will visit 0, then 1 and 2, then find 3
Path: 0 → 1 → 3 or 0 → 2 → 3 (both same length)
```

### Scenario 2: Weighted Path
```
Goal: Find cheapest path with different costs

Graph with weights:
  0 --1-- 1
  |       |
  5       1
  |       |
  2 --1-- 3 (goal)

1. Build graph with 4 nodes
2. Set weights: 0→1=1, 1→3=1, 0→2=5, 2→3=1
3. Mark node 3 as goal
4. Select "Uniform Cost"
5. Click "Start Search"

Result: Finds 0 → 1 → 3 (cost=2) instead of 0 → 2 → 3 (cost=6)
```

### Scenario 3: A* with Heuristics
```
Goal: Use estimated distances for optimal path

Graph:
  0 --- 1
  |     |
  2 --- 3 (goal)

Heuristics (distance estimate to goal):
- Node 0: h=4
- Node 1: h=2
- Node 2: h=2
- Node 3: h=0 (goal)

1. Build graph
2. Mark node 3 as goal
3. Set heuristics on nodes 0, 1, 2
4. Select "A*"
5. Click "Start Search"

Result: Uses both actual cost and heuristic for optimal path
```

---

## 🐛 Troubleshooting

### "Nothing happens when I click Start Search"

**Possible causes:**
1. ❌ No goal node set
   - **Solution**: Click "Toggle Goal" and mark at least one green node

2. ❌ No path to goal
   - **Solution**: Make sure nodes are connected (edges)

3. ❌ Graph too small
   - **Solution**: Add more nodes and connections

4. ❌ Wrong algorithm selected
   - **Solution**: Try "Breadth First" first (simplest)

### "Nodes don't turn purple/orange"

**Check:**
- Press F12 and check Console for errors
- Make sure there's a path from red node (source) to green node (goal)
- Verify edges are connected properly

### "Can't click nodes after zoom"

**Fixed!** Nodes now stay consistent size when zooming.

---

## 💡 Pro Tips

### For Best Results:

1. **Start Simple**: 
   - 4-5 nodes
   - Clear path to goal
   - Use Breadth First algorithm

2. **Test Algorithms**:
   - Build one graph
   - Try all algorithms on it
   - Compare results

3. **Use Weights**:
   - Make some paths "expensive"
   - See how Uniform Cost finds cheaper route

4. **Try A***:
   - Set good heuristics (lower = closer to goal)
   - Watch it find optimal path quickly

5. **Export Your Work**:
   - Click GIF before running to record
   - Export PNG for screenshots
   - Use in presentations!

---

## 📚 Algorithm Comparison

### Simple Graph Test:
```
  0 --- 1 --- 3 (goal)
  |           |
  2 ----------+
  
Edges: 0-1, 1-3, 0-2, 2-3
```

| Algorithm | Nodes Visited | Path Found | Speed |
|-----------|--------------|------------|-------|
| Breadth First | 0,1,2,3 | 0→1→3 | Fast |
| Depth First | 0,1,3 or 0,2,3 | Depends | Fast |
| Uniform Cost | 0,1,2,3 | Cheapest | Medium |
| A* | Fewer nodes | Optimal | Fastest |

---

## 🎓 Educational Use

### For Students:
- Understand how algorithms explore graphs
- See difference between informed/uninformed search
- Visualize why A* is efficient

### For Teachers:
- Demonstrate algorithm behavior live
- Compare different strategies
- Export GIFs for presentations

---

## ❓ Quick FAQ

**Q: What's the red node?**  
A: Source node (starting point) - you can't delete it

**Q: Can I have multiple goals?**  
A: Yes! Toggle as many green nodes as you want

**Q: What's a good heuristic value?**  
A: Estimated distance to goal (0 = at goal, higher = farther)

**Q: Why use Directed vs Undirected?**  
A: Use directed for one-way relationships (like road directions)

**Q: Which algorithm is best?**  
A: A* for optimal paths, Breadth First for simplicity

---

## 🚀 Ready to Visualize!

1. Open the app
2. Add nodes (click canvas)
3. Connect nodes (click two nodes)
4. Set goal (toggle goal tool)
5. Choose algorithm
6. Click "Start Search"
7. Watch the magic! ✨

**Happy Learning! 🎉**
