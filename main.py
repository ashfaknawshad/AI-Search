from browser import document, window
from javascript import Math as jsMath
import javascript

from SearchAgent import SearchAgent
from Node import Node


########################################
########      Global State      ########
########################################

# Canvas and rendering
canvas = None
ctx = None
window_width = 0
window_height = 0
graph_updated = True

# Pan and Zoom
pan_x = 0
pan_y = 0
zoom_level = 1.0
is_panning = False
last_mouse_x = 0
last_mouse_y = 0

# Node dragging
is_dragging_node = False
dragged_node_name = None

# Graph visualization
circle_radius = 20
weight_text_shift = 10
show_labels = True  # Toggle for heuristics and weights display
circle_colors = {
    "unselected": "#1e293b",
    "selected": "#ef4444"
}
node_colors = {
    "empty": "white",
    "source": "#ef4444",
    "goal": "#10b981",
    "visited": "#8b5cf6",
    "path": "#f59e0b"
}

# Graph configuration
search_agent = None
node_counter = 0
unselected = " "
selected_tool = "add_node"
selected_node_name = unselected
selected_edge_ends = unselected
selected_search_algorithm = "breadth-first"

# Animation and search
start_date = 0
search_generator = None
nodes_visited_count = 0
search_start_time = 0

# Undo/Redo functionality
history_stack = []
redo_stack = []
max_history = 50  # Maximum number of undo states to keep

# GIF Recording
gif_recorder = None


########################################
########      Canvas Setup      ########
########################################

def init_canvas():
    global canvas, ctx, window_width, window_height, search_agent, node_counter, gif_recorder
    
    canvas = document["canvas"]
    ctx = canvas.getContext("2d")
    
    window_width = window.innerWidth
    window_height = window.innerHeight
    canvas["width"] = window_width
    canvas["height"] = window_height
    
    # Initialize search agent with centered source node
    search_agent = SearchAgent({
        0: Node(0, (window_width / 2, window_height / 2), state="source", children={}),
    })
    node_counter = 0
    
    # Get GIF recorder from window (initialized in JavaScript)
    try:
        gif_recorder = window.gifRecorder
    except:
        print("GIF recorder not available yet")


def transform_point(x, y):
    """Transform screen coordinates to canvas coordinates"""
    return (
        (x - pan_x) / zoom_level,
        (y - pan_y) / zoom_level
    )


def inverse_transform_point(x, y):
    """Transform canvas coordinates to screen coordinates"""
    return (
        x * zoom_level + pan_x,
        y * zoom_level + pan_y
    )


########################################
########    Zoom & Pan Logic    ########
########################################

def handle_wheel(event):
    global zoom_level, pan_x, pan_y, graph_updated
    
    event.preventDefault()
    
    # Get mouse position
    mouse_x = event.clientX
    mouse_y = event.clientY
    
    # Calculate zoom factor
    zoom_factor = 1.1 if event.deltaY < 0 else 0.9
    new_zoom = zoom_level * zoom_factor
    
    # Clamp zoom level
    new_zoom = max(0.3, min(3.0, new_zoom))
    
    if new_zoom != zoom_level:
        # Zoom towards mouse position
        pan_x = mouse_x - (mouse_x - pan_x) * (new_zoom / zoom_level)
        pan_y = mouse_y - (mouse_y - pan_y) * (new_zoom / zoom_level)
        zoom_level = new_zoom
        graph_updated = True


def handle_mouse_down(event):
    global is_panning, last_mouse_x, last_mouse_y, selected_tool
    global is_dragging_node, dragged_node_name
    
    # Right click or middle click for panning
    if event.button == 2 or event.button == 1:
        is_panning = True
        last_mouse_x = event.clientX
        last_mouse_y = event.clientY
        event.preventDefault()
        return
    
    # Left click
    if event.button == 0:
        # Check if clicking on a node for dragging (when move_node tool is selected)
        # Convert screen coordinates to canvas coordinates
        x, y = transform_point(event.clientX, event.clientY)
        node_name = get_clicked_node_name(x, y, circle_radius)
        
        # If move_node tool is selected
        if selected_tool == "move_node":
            if node_name != -1:
                # Clicking on a node - enable node dragging
                save_state()  # Save state before starting drag
                is_dragging_node = True
                dragged_node_name = node_name
                last_mouse_x = event.clientX
                last_mouse_y = event.clientY
            else:
                # Clicking on empty space - enable canvas panning
                is_panning = True
                last_mouse_x = event.clientX
                last_mouse_y = event.clientY
            return
        
        # Otherwise, handle tool actions
        handle_tool_action(event)


def handle_mouse_move(event):
    global pan_x, pan_y, last_mouse_x, last_mouse_y, graph_updated
    global is_dragging_node, dragged_node_name
    
    if is_panning:
        dx = event.clientX - last_mouse_x
        dy = event.clientY - last_mouse_y
        pan_x += dx
        pan_y += dy
        last_mouse_x = event.clientX
        last_mouse_y = event.clientY
        graph_updated = True
        return
    
    if is_dragging_node and dragged_node_name is not None:
        # Calculate movement in canvas coordinates
        dx = event.clientX - last_mouse_x
        dy = event.clientY - last_mouse_y
        
        # Apply movement scaled by zoom level
        node = search_agent.graph[dragged_node_name]
        node.position = (
            node.position[0] + dx / zoom_level,
            node.position[1] + dy / zoom_level
        )
        
        last_mouse_x = event.clientX
        last_mouse_y = event.clientY
        graph_updated = True
        return
    
    # Update cursor based on hover (when move_node tool is selected)
    if selected_tool == "move_node":
        x, y = transform_point(event.clientX, event.clientY)
        node_name = get_clicked_node_name(x, y, circle_radius)
        
        if node_name != -1:
            canvas.style.cursor = "move"
        else:
            canvas.style.cursor = "default"


def handle_mouse_up(event):
    global is_panning, is_dragging_node, dragged_node_name
    
    is_panning = False
    is_dragging_node = False
    dragged_node_name = None


def zoom_in():
    global zoom_level, pan_x, pan_y, graph_updated
    new_zoom = min(zoom_level * 1.2, 3.0)
    
    # Zoom towards center
    center_x = window_width / 2
    center_y = window_height / 2
    pan_x = center_x - (center_x - pan_x) * (new_zoom / zoom_level)
    pan_y = center_y - (center_y - pan_y) * (new_zoom / zoom_level)
    
    zoom_level = new_zoom
    graph_updated = True


def zoom_out():
    global zoom_level, pan_x, pan_y, graph_updated
    new_zoom = max(zoom_level * 0.8, 0.3)
    
    # Zoom towards center
    center_x = window_width / 2
    center_y = window_height / 2
    pan_x = center_x - (center_x - pan_x) * (new_zoom / zoom_level)
    pan_y = center_y - (center_y - pan_y) * (new_zoom / zoom_level)
    
    zoom_level = new_zoom
    graph_updated = True


def reset_view():
    global zoom_level, pan_x, pan_y, graph_updated
    zoom_level = 1.0
    pan_x = 0
    pan_y = 0
    graph_updated = True


def toggle_labels():
    """Toggle display of heuristics and edge weights"""
    global show_labels, graph_updated
    show_labels = not show_labels
    
    # Toggle button visual state
    try:
        btn = document["toggle_labels"]
        if show_labels:
            btn.classList.add("active")
        else:
            btn.classList.remove("active")
    except Exception:
        pass
    
    graph_updated = True
    print(f"Labels display: {'ON' if show_labels else 'OFF'}")


def reset_canvas():
    """Reset the entire canvas - clear all nodes and edges, but keep start node"""
    global search_agent, node_counter, graph_updated, zoom_level, pan_x, pan_y
    
    # Confirm before resetting
    if window.confirm("Are you sure you want to reset the canvas? This will clear all nodes and edges."):
        save_state()  # Save state before resetting
        # Reset the graph with a new centered source node
        search_agent.graph = {
            0: Node(0, (window_width / 2, window_height / 2), state="source", children={}),
        }
        node_counter = 0
        
        # Reset view
        zoom_level = 1.0
        pan_x = 0
        pan_y = 0
        
        # Re-enable solve button if it was disabled
        try:
            document["solve"].disabled = False
        except Exception:
            pass
        
        graph_updated = True
        print("Canvas reset complete - start node preserved")


########################################
########   Undo/Redo Functions  ########
########################################

def save_state():
    """Save current graph state to history stack"""
    global history_stack, redo_stack
    
    # Create a deep copy of the current graph state
    state = {
        'graph': {},
        'node_counter': node_counter,
        'pan_x': pan_x,
        'pan_y': pan_y,
        'zoom_level': zoom_level
    }
    
    # Copy all nodes and their properties
    for name, node in search_agent.graph.items():
        state['graph'][name] = {
            'name': node.name,
            'position': (node.position[0], node.position[1]),
            'state': node.state,
            'heuristic': node.heuristic,
            'children': dict(node.children)  # Copy the children dictionary
        }
    
    history_stack.append(state)
    
    # Limit history size
    if len(history_stack) > max_history:
        history_stack.pop(0)
    
    # Clear redo stack when new action is performed
    redo_stack.clear()


def undo():
    """Undo the last action"""
    global history_stack, redo_stack, search_agent, node_counter, graph_updated
    global pan_x, pan_y, zoom_level, selected_node_name
    
    if len(history_stack) == 0:
        print("Nothing to undo")
        return
    
    # Save current state to redo stack before undoing
    current_state = {
        'graph': {},
        'node_counter': node_counter,
        'pan_x': pan_x,
        'pan_y': pan_y,
        'zoom_level': zoom_level
    }
    
    for name, node in search_agent.graph.items():
        current_state['graph'][name] = {
            'name': node.name,
            'position': (node.position[0], node.position[1]),
            'state': node.state,
            'heuristic': node.heuristic,
            'children': dict(node.children)
        }
    
    redo_stack.append(current_state)
    
    # Restore previous state
    state = history_stack.pop()
    restore_state(state)
    
    print("Undo successful")


def redo():
    """Redo the last undone action"""
    global redo_stack, history_stack, search_agent, node_counter, graph_updated
    global pan_x, pan_y, zoom_level
    
    if len(redo_stack) == 0:
        print("Nothing to redo")
        return
    
    # Save current state to history stack before redoing
    current_state = {
        'graph': {},
        'node_counter': node_counter,
        'pan_x': pan_x,
        'pan_y': pan_y,
        'zoom_level': zoom_level
    }
    
    for name, node in search_agent.graph.items():
        current_state['graph'][name] = {
            'name': node.name,
            'position': (node.position[0], node.position[1]),
            'state': node.state,
            'heuristic': node.heuristic,
            'children': dict(node.children)
        }
    
    history_stack.append(current_state)
    
    # Restore redo state
    state = redo_stack.pop()
    restore_state(state)
    
    print("Redo successful")


def restore_state(state):
    """Restore a saved state"""
    global search_agent, node_counter, graph_updated, pan_x, pan_y, zoom_level
    global selected_node_name
    
    # Restore node counter and view settings
    node_counter = state['node_counter']
    pan_x = state['pan_x']
    pan_y = state['pan_y']
    zoom_level = state['zoom_level']
    
    # Clear current graph
    search_agent.graph.clear()
    
    # Restore all nodes
    for name, node_data in state['graph'].items():
        search_agent.graph[name] = Node(
            node_data['name'],
            node_data['position'],
            state=node_data['state'],
            children=node_data['children']
        )
        search_agent.graph[name].heuristic = node_data['heuristic']
    
    # Clear selection
    selected_node_name = unselected
    graph_updated = True


########################################
########     Tool Actions       ########
########################################

def handle_tool_action(event):
    global selected_tool, search_agent, node_counter, graph_updated
    global selected_node_name, selected_edge_ends
    
    # Transform screen coordinates to canvas coordinates
    screen_x = event.clientX
    screen_y = event.clientY
    x, y = transform_point(screen_x, screen_y)
    
    node_name = get_clicked_node_name(x, y, circle_radius)
    
    if node_name == -1:
        # No node clicked
        if selected_tool == "add_node":
            if get_clicked_node_name(x, y, circle_radius * 3) == -1:
                save_state()  # Save state before adding node
                node_counter += 1
                search_agent.graph[node_counter] = Node(
                    node_counter, (x, y), children={}
                )
                graph_updated = True
        elif selected_tool in ["add_edge"]:
            selected_node_name = unselected
            graph_updated = True
        elif selected_tool == "delete_edge":
            # Check if user clicked on an edge directly
            edge_ends = get_clicked_edge_ends(x, y, 15)
            if edge_ends != -1:
                save_state()  # Save state before deleting edge
                from_node, to_node = edge_ends
                search_agent.graph[from_node].children.pop(to_node, None)
                search_agent.graph[to_node].children.pop(from_node, None)
                graph_updated = True
            else:
                # Reset selection if clicking empty space
                selected_node_name = unselected
                graph_updated = True
        elif selected_tool == "update_weight":
            edge_ends = get_clicked_edge_ends(x, y, 12)
            if edge_ends != -1:
                selected_edge_ends = edge_ends
                show_input_dialog()
                graph_updated = True
    else:
        # Node clicked
        if selected_tool == "toggle_goal":
            if search_agent.graph[node_name].state != "source":
                save_state()  # Save state before toggling goal
                if search_agent.graph[node_name].state == "goal":
                    search_agent.graph[node_name].state = "empty"
                else:
                    search_agent.graph[node_name].state = "goal"
                    search_agent.graph[node_name].heuristic = 0
                graph_updated = True
        
        elif selected_tool == "update_heuristic":
            if search_agent.graph[node_name].state != "goal":
                selected_node_name = node_name
                show_input_dialog()
                graph_updated = True
        
        elif selected_tool == "delete_node":
            if search_agent.graph[node_name].state != "source":
                save_state()  # Save state before deleting node
                search_agent.graph.pop(node_name)
                for node in search_agent.graph.values():
                    search_agent.graph[node.name].children.pop(node_name, None)
                graph_updated = True
        
        elif selected_tool == "add_edge":
            if selected_node_name == unselected:
                selected_node_name = node_name
                graph_updated = True
            elif selected_node_name != node_name:
                if node_name not in search_agent.graph[selected_node_name].children:
                    save_state()  # Save state before adding edge
                    search_agent.graph[selected_node_name].children[node_name] = 1
                    search_agent.graph[node_name].children[selected_node_name] = 1
                    selected_node_name = unselected
                    graph_updated = True
        
        elif selected_tool == "delete_edge":
            if selected_node_name == unselected:
                selected_node_name = node_name
                graph_updated = True
            elif selected_node_name != node_name:
                if node_name in search_agent.graph[selected_node_name].children:
                    save_state()  # Save state before deleting edge
                    search_agent.graph[selected_node_name].children.pop(node_name, None)
                    search_agent.graph[node_name].children.pop(selected_node_name, None)
                    selected_node_name = unselected
                    graph_updated = True


def get_clicked_node_name(x, y, radius):
    for node in search_agent.graph.values():
        dx = x - node.position[0]
        dy = y - node.position[1]
        distance = jsMath.sqrt(dx * dx + dy * dy)
        if distance <= radius:
            return node.name
    return -1


def get_clicked_edge_ends(x, y, radius):
    for node in search_agent.graph.values():
        for child_name, weight in node.children.items():
            child = search_agent.graph[child_name]
            # Calculate text position
            text_x = (node.position[0] + child.position[0]) / 2
            text_y = (node.position[1] + child.position[1]) / 2
            
            dx = x - text_x
            dy = y - text_y
            if jsMath.sqrt(dx * dx + dy * dy) <= radius:
                return (node.name, child_name)
    return -1


########################################
########      Rendering         ########
########################################

def get_canvas_bg_color():
    """Get the current canvas background color from CSS variable"""
    try:
        # Get computed style from body
        styles = window.getComputedStyle(document.body)
        return styles.getPropertyValue('--canvas-bg').strip()
    except Exception:
        # Fallback to dark mode color
        return '#0f172a'


def toggle_theme():
    """Toggle between light and dark mode"""
    global graph_updated
    body = document.body
    theme_icon = document["theme_icon"]
    
    if body.classList.contains('light-mode'):
        body.classList.remove('light-mode')
        theme_icon.setAttribute('data-lucide', 'moon')
        print("Switched to dark mode")
    else:
        body.classList.add('light-mode')
        theme_icon.setAttribute('data-lucide', 'sun')
        print("Switched to light mode")
    
    # Re-initialize Lucide icons
    try:
        window.lucide.createIcons()
    except Exception:
        pass
    
    graph_updated = True


def draw():
    global graph_updated
    
    if not graph_updated:
        return
    
    # Clear canvas and fill with background color
    ctx.clearRect(0, 0, window_width, window_height)
    
    # Get canvas background color from CSS variable
    canvas_bg = get_canvas_bg_color()
    ctx.fillStyle = canvas_bg
    ctx.fillRect(0, 0, window_width, window_height)
    
    # Draw grid background
    draw_grid()
    
    # Apply transformations
    ctx.save()
    ctx.translate(pan_x, pan_y)
    ctx.scale(zoom_level, zoom_level)
    
    # Draw edges
    ctx.lineWidth = 3
    ctx.font = f'{int(16)}px Inter, sans-serif'
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    for node in search_agent.graph.values():
        for child_name, weight in node.children.items():
            child = search_agent.graph[child_name]
            
            # Draw edge line
            ctx.strokeStyle = "#94a3b8"
            ctx.beginPath()
            ctx.moveTo(*node.position)
            ctx.lineTo(*child.position)
            ctx.stroke()
            
            # Draw weight (only if labels are enabled)
            if show_labels:
                text_x = (node.position[0] + child.position[0]) / 2
                text_y = (node.position[1] + child.position[1]) / 2
                
                # Background for weight text
                ctx.fillStyle = "white"
                ctx.fillRect(text_x - 15, text_y - 10, 30, 20)
                
                ctx.fillStyle = "#475569"
                ctx.fillText(str(weight), text_x, text_y)
    
    # Draw nodes
    for node in search_agent.graph.values():
        # Node circle
        is_selected = node.name == selected_node_name
        ctx.strokeStyle = circle_colors["selected"] if is_selected else circle_colors["unselected"]
        ctx.lineWidth = 4 if is_selected else 3
        
        ctx.beginPath()
        ctx.arc(*node.position, circle_radius, 0, 2 * jsMath.PI)
        ctx.fillStyle = node_colors[node.state]
        ctx.fill()
        ctx.stroke()
        
        # Node label
        ctx.font = f'bold {int(14)}px Inter, sans-serif'
        ctx.fillStyle = "#1e293b" if node.state == "empty" else "white"
        ctx.fillText(str(node.name), node.position[0], node.position[1] - 6)
        
        # Heuristic value (only if labels are enabled)
        if show_labels:
            ctx.font = f'{int(11)}px Inter, sans-serif'
            ctx.fillText(f"h={node.heuristic}", node.position[0], node.position[1] + 8)
    
    ctx.restore()
    graph_updated = False


def draw_grid():
    """Draw a subtle grid background"""
    ctx.save()
    
    # Use different grid color based on theme
    if document.body.classList.contains('light-mode'):
        ctx.strokeStyle = "rgba(0, 0, 0, 0.05)"
    else:
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    
    ctx.lineWidth = 1
    
    grid_size = 50 * zoom_level
    offset_x = pan_x % grid_size
    offset_y = pan_y % grid_size
    
    # Vertical lines
    x = offset_x
    while x < window_width:
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, window_height)
        ctx.stroke()
        x += grid_size
    
    # Horizontal lines
    y = offset_y
    while y < window_height:
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(window_width, y)
        ctx.stroke()
        y += grid_size
    
    ctx.restore()


########################################
########    Animation Loop      ########
########################################

def animation_loop(event=None):
    global start_date, search_generator, graph_updated, gif_recorder
    
    # Advance search if running
    if search_agent and search_agent.is_agent_searching:
        now = javascript.Date.now()
        if now - start_date >= 500:  # 500ms between steps
            try:
                next(search_generator)
                graph_updated = True
                # Debug: print current node states after each step
                try:
                    states = {n.name: n.state for n in search_agent.graph.values()}
                    print(f"after_step: {states}")
                except Exception:
                    print("after_step: (could not serialize states)")
                start_date = now
                
                # Capture frame for GIF if recording
                try:
                    if window.gifRecorder and window.gifRecorder.recording:
                        window.gifRecorder.captureFrame()
                except:
                    pass
                    
            except StopIteration:
                print("Search completed")
                # Re-enable solve button when search finishes
                try:
                    document["solve"].disabled = False
                except Exception:
                    pass
                
                # Calculate search statistics
                search_end_time = javascript.Date.now()
                time_taken = round((search_end_time - search_start_time) / 1000, 2)
                
                # Get result details
                success = search_agent.agent_status == "success"
                nodes_visited = search_agent.nodes_visited
                path_cost = 0
                
                if success:
                    # Find goal node to get path cost
                    for node in search_agent.graph.values():
                        if node.state == "path" or node.state == "goal":
                            path_cost = len([n for n in search_agent.graph.values() if n.state == "path"])
                            break
                
                # Show search results toast
                show_search_results(success, path_cost, nodes_visited, time_taken)
                
                # Make sure the final graph state (path) is drawn
                graph_updated = True
                # Immediately redraw so the solution path appears right away
                try:
                    draw()
                except Exception:
                    pass
                # Auto-stop GIF recording if it was running
                try:
                    if window.gifRecorder and window.gifRecorder.recording:
                        def stop_gif():
                            window.gifRecorder.stopRecording()
                            # Reset button border
                            document["export_gif"].style.borderColor = ''
                        # Delay to capture final frame
                        window.setTimeout(stop_gif, 600)
                except:
                    pass
    
    # Draw after updating search state
    draw()
    
    window.requestAnimationFrame(animation_loop)


########################################
########    UI Interactions     ########
########################################

def show_search_results(success, path_cost, nodes_visited, time_taken):
    """Show search results in a toast notification"""
    toast = document["search-results-toast"]
    stats_div = document["search-stats"]
    
    # Build stats HTML with minimal styling
    if success:
        stats_html = f"""
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">●</span>
                <span>Goal Found</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">Path:</span>
                <span style="color: #f1f5f9; font-weight: 500;">{path_cost} edges</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">Visited:</span>
                <span style="color: #f1f5f9; font-weight: 500;">{nodes_visited} nodes</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">Time:</span>
                <span style="color: #f1f5f9; font-weight: 500;">{time_taken}s</span>
                <i data-lucide="info" class="time-info-icon" data-tippy-content="Time includes visualization delays (animation speed). Actual algorithm computation is nearly instantaneous." style="width: 14px; height: 14px; color: #64748b; cursor: help; margin-left: 4px;"></i>
            </div>
        """
    else:
        stats_html = f"""
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">●</span>
                <span>No Path Found</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">Visited:</span>
                <span style="color: #f1f5f9; font-weight: 500;">{nodes_visited} nodes</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="color: #94a3b8;">Time:</span>
                <span style="color: #f1f5f9; font-weight: 500;">{time_taken}s</span>
                <i data-lucide="info" class="time-info-icon" data-tippy-content="Time includes visualization delays (animation speed). Actual algorithm computation is nearly instantaneous." style="width: 14px; height: 14px; color: #64748b; cursor: help; margin-left: 4px;"></i>
            </div>
        """
    
    stats_div.innerHTML = stats_html
    toast.style.display = "block"
    
    # Reinitialize Lucide icons and Tippy tooltips for the new content
    window.lucide.createIcons()
    window.tippy('[data-tippy-content]', {
        'placement': 'top',
        'animation': 'scale',
        'duration': 200,
        'zIndex': 10001,
    })
    
    # No auto-hide - stays until user closes it


def select_tool(tool_name):
    global selected_tool
    selected_tool = tool_name


def select_algorithm(algo_name):
    global selected_search_algorithm
    selected_search_algorithm = algo_name


def show_input_dialog():
    document["weights-modal"].showModal()


def hide_input_dialog():
    global selected_node_name, selected_edge_ends, graph_updated
    document["weights-modal"].close()
    selected_node_name = unselected
    selected_edge_ends = unselected
    graph_updated = True


def show_color_dialog():
    """Show the color customization dialog"""
    document["color-modal"].showModal()


def hide_color_dialog():
    """Hide the color customization dialog"""
    document["color-modal"].close()


def update_color(color_type, color_value):
    """Update node color in real-time"""
    global node_colors, graph_updated
    node_colors[color_type] = color_value
    graph_updated = True


def reset_colors():
    """Reset all colors to default values"""
    global node_colors, graph_updated
    
    # Default colors
    default_colors = {
        "empty": "#ffffff",
        "source": "#ef4444",
        "goal": "#10b981",
        "visited": "#8b5cf6",
        "path": "#f59e0b"
    }
    
    # Update the color pickers
    document["color-empty"].value = default_colors["empty"]
    document["color-source"].value = default_colors["source"]
    document["color-goal"].value = default_colors["goal"]
    document["color-visited"].value = default_colors["visited"]
    document["color-path"].value = default_colors["path"]
    
    # Update the global colors
    node_colors.update(default_colors)
    graph_updated = True


def update_heuristic():
    global graph_updated
    validated = document["weights-form"].reportValidity()
    if validated:
        save_state()  # Save state before updating heuristic
        heuristic = int(document["weights-input"].value)
        search_agent.graph[selected_node_name].heuristic = heuristic
        hide_input_dialog()
        graph_updated = True


def update_weight():
    global graph_updated
    validated = document["weights-form"].reportValidity()
    if validated:
        save_state()  # Save state before updating weight
        weight = int(document["weights-input"].value)
        from_node, to_node = selected_edge_ends
        search_agent.graph[from_node].children[to_node] = weight
        search_agent.graph[to_node].children[from_node] = weight
        hide_input_dialog()
        graph_updated = True


def start_search():
    global search_generator, start_date, search_start_time, gif_recorder, graph_updated
    
    # Check if there's a goal
    has_goal = False
    for node in search_agent.graph.values():
        if node.state == "goal":
            has_goal = True
            break
    
    if not has_goal:
        window.alert("Please set at least one goal node (green) before starting search!")
        return
    
    algorithms = {
        "breadth-first": search_agent.breadth_first_search,
        "depth-first": search_agent.depth_first_search,
        "depth-limit": lambda: search_agent.depth_limit_search(3),
        "iterative-deepening": lambda: search_agent.iterative_deepening_search(10),
        "uniform-cost": search_agent.uniform_cost_search,
        "bidirectional": search_agent.bidirectional_search,
        "greedy": search_agent.greedy_search,
        "a*": search_agent.a_star_search,
    }
    
    if selected_search_algorithm in algorithms:
        print(f"Starting {selected_search_algorithm} search...")
        
        # Record search start time
        search_start_time = javascript.Date.now()
        
        search_generator = algorithms[selected_search_algorithm]()
        # Debug: show generator object
        try:
            print(f"search_generator -> {search_generator}")
        except Exception:
            pass

        # Bootstrap the generator so reserve_agent() runs and sets searching state
        try:
            # Advance to the first yield (or complete)
            next(search_generator)
            graph_updated = True
        except StopIteration:
            # Generator finished immediately
            print("search_generator finished immediately")

        # Disable solve button to prevent multiple starts
        try:
            document["solve"].disabled = True
        except Exception:
            pass

        start_date = javascript.Date.now()
        
        # Capture initial frame for GIF if recording
        try:
            if window.gifRecorder and window.gifRecorder.recording:
                window.gifRecorder.captureFrame()
        except:
            pass
    else:
        print(f"Algorithm not found: {selected_search_algorithm}")


########################################
########         Main           ########
########################################

def update_selected_display(algo_name):
    """Update the compact view to show selected algorithm"""
    try:
        document["selected-algo-display"].text = algo_name
        # Collapse panel after selection
        panel = document["algorithm-panel"]
        panel.classList.remove("expanded")
    except Exception as e:
        print(f"Error updating display: {e}")

def toggle_panel(e):
    """Toggle expand/collapse of algorithm panel"""
    # Don't toggle if clicking the solve button
    target_id = e.target.id
    
    # Try to find parent button
    try:
        parent_button = e.target.closest("button")
    except:
        parent_button = None
    
    if target_id == "solve" or (parent_button and parent_button.id == "solve"):
        return
    
    # Don't toggle if clicking algorithm buttons when expanded
    panel = document["algorithm-panel"]
    if panel.classList.contains("expanded"):
        if e.target.classList.contains("algo-btn") or (parent_button and parent_button.classList.contains("algo-btn")):
            return
    
    # Toggle the panel
    panel.classList.toggle("expanded")
    # Prevent event from bubbling
    e.stopPropagation()

def collapse_panel_outside(e):
    """Collapse panel when clicking outside"""
    panel = document["algorithm-panel"]
    if panel.classList.contains("expanded"):
        # Check if click is outside the panel
        try:
            closest_panel = e.target.closest("#algorithm-panel")
            if closest_panel is None:
                panel.classList.remove("expanded")
        except:
            # If closest fails, collapse the panel
            panel.classList.remove("expanded")


def handle_keyboard_shortcuts(e):
    """Handle keyboard shortcuts for undo/redo"""
    # Check for Ctrl+Z (undo) or Ctrl+Y (redo)
    # On Mac, it's Cmd+Z and Cmd+Shift+Z
    if (e.ctrlKey or e.metaKey):
        if e.key.lower() == 'z' and not e.shiftKey:
            e.preventDefault()
            undo()
        elif e.key.lower() == 'y' or (e.key.lower() == 'z' and e.shiftKey):
            e.preventDefault()
            redo()


def main():
    global start_date
    
    init_canvas()
    
    # Bind canvas events
    canvas.bind("wheel", handle_wheel)
    canvas.bind("mousedown", handle_mouse_down)
    canvas.bind("mousemove", handle_mouse_move)
    canvas.bind("mouseup", handle_mouse_up)
    canvas.bind("contextmenu", lambda e: e.preventDefault())
    
    # Bind tool buttons
    document["add_node"].bind("click", lambda e: select_tool("add_node"))
    document["move_node"].bind("click", lambda e: select_tool("move_node"))
    document["add_edge"].bind("click", lambda e: select_tool("add_edge"))
    document["delete_node"].bind("click", lambda e: select_tool("delete_node"))
    document["delete_edge"].bind("click", lambda e: select_tool("delete_edge"))
    document["toggle_goal"].bind("click", lambda e: select_tool("toggle_goal"))
    document["update_heuristic"].bind("click", lambda e: select_tool("update_heuristic"))
    document["update_weight"].bind("click", lambda e: select_tool("update_weight"))
    
    # Bind toggle labels button
    document["toggle_labels"].bind("click", lambda e: toggle_labels())
    
    # Bind reset canvas button
    document["reset_canvas"].bind("click", lambda e: reset_canvas())
    
    # Bind theme toggle button
    document["theme_toggle"].bind("click", lambda e: toggle_theme())
    
    # Bind algorithm buttons
    document["breadth-first"].bind("click", lambda e: (select_algorithm("breadth-first"), update_selected_display("Breadth First Search")))
    document["depth-first"].bind("click", lambda e: (select_algorithm("depth-first"), update_selected_display("Depth First Search")))
    document["depth-limit"].bind("click", lambda e: (select_algorithm("depth-limit"), update_selected_display("Depth Limited Search")))
    document["iterative-deepening"].bind("click", lambda e: (select_algorithm("iterative-deepening"), update_selected_display("Iterative Deepening")))
    document["uniform-cost"].bind("click", lambda e: (select_algorithm("uniform-cost"), update_selected_display("Uniform Cost Search")))
    document["bidirectional"].bind("click", lambda e: (select_algorithm("bidirectional"), update_selected_display("Bidirectional Search")))
    document["greedy"].bind("click", lambda e: (select_algorithm("greedy"), update_selected_display("Greedy Best First")))
    document["a*"].bind("click", lambda e: (select_algorithm("a*"), update_selected_display("A* Search")))
    
    # Bind solve button
    document["solve"].bind("click", lambda e: start_search())
    
    # Bind panel expand/collapse
    document["algorithm-panel"].bind("click", toggle_panel)
    document.bind("click", collapse_panel_outside)
    
    # Bind zoom controls
    document["zoom_in"].bind("click", lambda e: zoom_in())
    document["zoom_out"].bind("click", lambda e: zoom_out())
    document["zoom_reset"].bind("click", lambda e: reset_view())
    
    # Bind modal buttons
    document["weights-close"].bind("click", lambda e: hide_input_dialog())
    document["weights-update"].bind("click", lambda e: (
        update_heuristic() if selected_tool == "update_heuristic" else update_weight()
    ))
    
    # Bind color settings
    document["color_settings"].bind("click", lambda e: show_color_dialog())
    document["color-close"].bind("click", lambda e: hide_color_dialog())
    document["color-reset"].bind("click", lambda e: reset_colors())
    
    # Bind color inputs to update colors in real-time
    document["color-source"].bind("input", lambda e: update_color("source", e.target.value))
    document["color-goal"].bind("input", lambda e: update_color("goal", e.target.value))
    document["color-empty"].bind("input", lambda e: update_color("empty", e.target.value))
    document["color-visited"].bind("input", lambda e: update_color("visited", e.target.value))
    document["color-path"].bind("input", lambda e: update_color("path", e.target.value))
    
    # Bind keyboard shortcuts for undo/redo
    document.bind("keydown", handle_keyboard_shortcuts)
    
    # Start animation loop
    start_date = javascript.Date.now()
    window.requestAnimationFrame(animation_loop)


# Run main when loaded
main()
