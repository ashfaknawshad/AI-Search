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

# Graph visualization
circle_radius = 20
weight_text_shift = 10
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
graph_type = "undirected"
node_counter = 0
unselected = " "
selected_tool = "add_node"
selected_node_name = unselected
selected_edge_ends = unselected
selected_search_algorithm = "breadth-first"

# Animation and search
start_date = 0
search_generator = None

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
    
    # Right click or middle click for panning
    if event.button == 2 or event.button == 1:
        is_panning = True
        last_mouse_x = event.clientX
        last_mouse_y = event.clientY
        event.preventDefault()
        return
    
    # Left click for tool actions
    if event.button == 0:
        handle_tool_action(event)


def handle_mouse_move(event):
    global pan_x, pan_y, last_mouse_x, last_mouse_y, graph_updated
    
    if is_panning:
        dx = event.clientX - last_mouse_x
        dy = event.clientY - last_mouse_y
        pan_x += dx
        pan_y += dy
        last_mouse_x = event.clientX
        last_mouse_y = event.clientY
        graph_updated = True


def handle_mouse_up(event):
    global is_panning
    is_panning = False


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
                node_counter += 1
                search_agent.graph[node_counter] = Node(
                    node_counter, (x, y), children={}
                )
                graph_updated = True
        elif selected_tool in ["add_edge", "delete_edge"]:
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
                    search_agent.graph[selected_node_name].children[node_name] = 1
                    if graph_type == "undirected":
                        search_agent.graph[node_name].children[selected_node_name] = 1
                    selected_node_name = unselected
                    graph_updated = True
        
        elif selected_tool == "delete_edge":
            if selected_node_name == unselected:
                selected_node_name = node_name
                graph_updated = True
            elif selected_node_name != node_name:
                if node_name in search_agent.graph[selected_node_name].children:
                    search_agent.graph[selected_node_name].children.pop(node_name, None)
                    if graph_type == "undirected":
                        search_agent.graph[node_name].children.pop(selected_node_name, None)
                    selected_node_name = unselected
                    graph_updated = True


def get_clicked_node_name(x, y, radius):
    for node in search_agent.graph.values():
        dx = x - node.position[0]
        dy = y - node.position[1]
        if jsMath.sqrt(dx * dx + dy * dy) <= radius:
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

def draw():
    global graph_updated
    
    if not graph_updated:
        return
    
    # Clear canvas
    ctx.clearRect(0, 0, window_width, window_height)
    
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
            
            # Draw arrow for directed graphs
            if graph_type == "directed":
                draw_arrow(node.position, child.position)
            
            # Draw weight
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
        
        # Heuristic value
        ctx.font = f'{int(11)}px Inter, sans-serif'
        ctx.fillText(f"h={node.heuristic}", node.position[0], node.position[1] + 8)
    
    ctx.restore()
    graph_updated = False


def draw_grid():
    """Draw a subtle grid background"""
    ctx.save()
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


def draw_arrow(from_pos, to_pos):
    """Draw arrow head for directed edges"""
    dx = to_pos[0] - from_pos[0]
    dy = to_pos[1] - from_pos[1]
    distance = jsMath.sqrt(dx * dx + dy * dy)
    
    if distance == 0:
        return
    
    # Calculate arrow position (at circle edge)
    arrow_x = to_pos[0] - dx / distance * circle_radius
    arrow_y = to_pos[1] - dy / distance * circle_radius
    
    # Calculate arrow angle
    angle = jsMath.atan2(dy, dx)
    
    # Draw arrow head
    arrow_size = 10
    ctx.save()
    ctx.translate(arrow_x, arrow_y)
    ctx.rotate(angle)
    
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-arrow_size, -arrow_size / 2)
    ctx.lineTo(-arrow_size, arrow_size / 2)
    ctx.closePath()
    ctx.fillStyle = "#94a3b8"
    ctx.fill()
    
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
                if gif_recorder and gif_recorder.recording:
                    gif_recorder.captureFrame()
                    
            except StopIteration:
                print("Search completed")
                # Re-enable solve button when search finishes
                try:
                    document["solve"].disabled = False
                except Exception:
                    pass
                # Make sure the final graph state (path) is drawn
                graph_updated = True
                # Immediately redraw so the solution path appears right away
                try:
                    draw()
                except Exception:
                    pass
                # Auto-stop GIF recording if it was running
                if gif_recorder and gif_recorder.recording:
                    def stop_gif():
                        gif_recorder.stopRecording()
                        # Reset button text
                        document["export_gif"].innerHTML = '<i data-lucide="film"></i> GIF'
                        # Refresh icons
                        window.lucide.createIcons()
                    # Delay to capture final frame
                    window.setTimeout(stop_gif, 600)
    
    # Draw after updating search state
    draw()
    
    window.requestAnimationFrame(animation_loop)


########################################
########    UI Interactions     ########
########################################

def select_tool(tool_name):
    global selected_tool
    selected_tool = tool_name


def select_graph_type(type_name):
    global graph_type, graph_updated, search_agent, node_counter
    graph_type = type_name
    
    # Reset graph
    search_agent.graph = {
        0: Node(0, (window_width / 2, window_height / 2), state="source", children={}),
    }
    node_counter = 0
    graph_updated = True


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


def update_heuristic():
    global graph_updated
    validated = document["weights-form"].reportValidity()
    if validated:
        heuristic = int(document["weights-input"].value)
        search_agent.graph[selected_node_name].heuristic = heuristic
        hide_input_dialog()
        graph_updated = True


def update_weight():
    global graph_updated
    validated = document["weights-form"].reportValidity()
    if validated:
        weight = int(document["weights-input"].value)
        from_node, to_node = selected_edge_ends
        search_agent.graph[from_node].children[to_node] = weight
        if graph_type == "undirected":
            search_agent.graph[to_node].children[from_node] = weight
        hide_input_dialog()
        graph_updated = True


def start_search():
    global search_generator, start_date, gif_recorder, graph_updated
    
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
        "greedy": search_agent.greedy_search,
        "a*": search_agent.a_star_search,
    }
    
    if selected_search_algorithm in algorithms:
        print(f"Starting {selected_search_algorithm} search...")
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
        if gif_recorder and gif_recorder.recording:
            gif_recorder.captureFrame()
    else:
        print(f"Algorithm not found: {selected_search_algorithm}")


########################################
########         Main           ########
########################################

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
    document["add_edge"].bind("click", lambda e: select_tool("add_edge"))
    document["delete_node"].bind("click", lambda e: select_tool("delete_node"))
    document["delete_edge"].bind("click", lambda e: select_tool("delete_edge"))
    document["toggle_goal"].bind("click", lambda e: select_tool("toggle_goal"))
    document["update_heuristic"].bind("click", lambda e: select_tool("update_heuristic"))
    document["update_weight"].bind("click", lambda e: select_tool("update_weight"))
    
    # Bind graph type buttons
    document["undirected_graph"].bind("click", lambda e: select_graph_type("undirected"))
    document["directed_graph"].bind("click", lambda e: select_graph_type("directed"))
    
    # Bind algorithm buttons
    document["breadth-first"].bind("click", lambda e: select_algorithm("breadth-first"))
    document["depth-first"].bind("click", lambda e: select_algorithm("depth-first"))
    document["depth-limit"].bind("click", lambda e: select_algorithm("depth-limit"))
    document["iterative-deepening"].bind("click", lambda e: select_algorithm("iterative-deepening"))
    document["uniform-cost"].bind("click", lambda e: select_algorithm("uniform-cost"))
    document["greedy"].bind("click", lambda e: select_algorithm("greedy"))
    document["a*"].bind("click", lambda e: select_algorithm("a*"))
    
    # Bind solve button
    document["solve"].bind("click", lambda e: start_search())
    
    # Bind zoom controls
    document["zoom_in"].bind("click", lambda e: zoom_in())
    document["zoom_out"].bind("click", lambda e: zoom_out())
    document["zoom_reset"].bind("click", lambda e: reset_view())
    
    # Bind modal buttons
    document["weights-close"].bind("click", lambda e: hide_input_dialog())
    document["weights-update"].bind("click", lambda e: (
        update_heuristic() if selected_tool == "update_heuristic" else update_weight()
    ))
    
    # Start animation loop
    start_date = javascript.Date.now()
    window.requestAnimationFrame(animation_loop)


# Run main when loaded
main()
