from PriorityQueue import PriorityQueue
from Node import Node


class SearchAgent(object):
    """docstring for SearchAgent"""

    def __init__(self, graph={}):
        super(SearchAgent, self).__init__()
        self.__agent_status = "idle"
        self.graph = graph
        self.nodes_visited = 0  # Track number of nodes visited during search

    ################################################
    ########		Search Algorithms		########
    ################################################

    def breadth_first_search(self):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = []
        node = source
        fringe.append(node)

        while fringe:
            node = fringe.pop(0)
            if self.is_goal_state(node):
                self.finished("success", node)
                return

            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
                for n in self.expand(node):
                    if self.node_state(n) != "visited":
                        fringe.append(n)
                yield

        self.finished("failed", source)

    def depth_first_search(self):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = []
        node = source
        fringe.append(node)

        while fringe:
            node = fringe.pop()
            if self.is_goal_state(node):
                self.finished("success", node)
                return

            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
                # Reverse to ensure leftmost child is explored first (since we pop from end)
                for n in reversed(self.expand(node)):
                    if self.node_state(n) != "visited":
                        fringe.append(n)
                yield

        self.finished("failed", source)

    def depth_limit_search(self, limit):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = []
        node = source
        fringe.append(node)

        while fringe:
            node = fringe.pop()
            if self.is_goal_state(node):
                self.finished("success", node)
                return

            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
            if len(node.path) < limit:
                # Reverse to ensure leftmost child is explored first
                for n in reversed(self.expand(node)):
                    if self.node_state(n) != "visited":
                        fringe.append(n)

            yield

        self.finished("failed", source)

    def iterative_deepening_search(self, max_depth_limit):
        source = self.source
        if not self.reserve_agent():
            return
        
        # Try increasing depth limits from 1 to max_depth_limit (inclusive)
        for limit in range(1, max_depth_limit + 1):
            self.reset_graph()
            fringe = []
            node = source
            fringe.append(node)

            while fringe:
                node = fringe.pop()
                if self.is_goal_state(node):
                    self.finished("success", node)
                    return

                if self.node_state(node) != "visited":
                    self.set_node_state(node, "visited")
                if len(node.path) < limit:
                    # Reverse to ensure leftmost child is explored first
                    for i in reversed(self.expand(node)):
                        if self.node_state(i) != "visited":
                            fringe.append(i)

                yield
        
        # If we exhausted all depth limits without finding goal
        self.finished("failed", source)

    def uniform_cost_search(self):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = PriorityQueue()
        node = source
        fringe.add(node, node.cost)

        while fringe.isNotEmpty():
            node = fringe.pop()
            if self.is_goal_state(node):
                self.finished("success", node)
                return
            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
                for n in self.expand(node):
                    if self.node_state(n) != "visited":
                        fringe.add(n, n.cost)

            yield

        self.finished("failed", source)

    def greedy_search(self):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = PriorityQueue()
        node = source
        fringe.add(node, node.heuristic)

        while fringe.isNotEmpty():
            node = fringe.pop()
            if self.is_goal_state(node):
                self.finished("success", node)
                return
            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
                for n in self.expand(node):
                    if self.node_state(n) != "visited":
                        fringe.add(n, n.heuristic)

            yield

        self.finished("failed", source)

    def a_star_search(self):
        source = self.source
        if not self.reserve_agent():
            return

        self.reset_graph()
        fringe = PriorityQueue()
        node = source
        fringe.add(node, node.cost + node.heuristic)

        while fringe.isNotEmpty():
            node = fringe.pop()
            if self.is_goal_state(node):
                self.finished("success", node)
                return
            if self.node_state(node) != "visited":
                self.set_node_state(node, "visited")
                for n in self.expand(node):
                    if self.node_state(n) != "visited":
                        fringe.add(n, n.cost + n.heuristic)

            yield

        self.finished("failed", source)

    def bidirectional_search(self):
        """
        Bidirectional BFS: Search from both start and goal simultaneously.
        Meet in the middle for faster search on large graphs.
        """
        source = self.source
        if not self.reserve_agent():
            return

        # Find goal node
        goal_node = None
        for node in self.graph.values():
            if node.state == "goal":
                goal_node = node
                break
        
        if goal_node is None:
            self.finished("failed", source)
            return

        self.reset_graph()

        # Build a predecessor map for efficient backward search
        predecessors = {name: [] for name in self.graph}
        for name, node in self.graph.items():
            for child_name in node.children:
                predecessors[child_name].append(name)
        
        # Two frontiers: forward from start, backward from goal
        forward_fringe = [source]
        backward_fringe = [goal_node]
        
        # Track visited nodes and their predecessors for path reconstruction
        forward_visited = {}  # {node_name: parent_name}
        backward_visited = {}
        
        # Mark source and goal as visited
        forward_visited[source.name] = None
        backward_visited[goal_node.name] = None
        
        # Alternate between forward and backward search
        forward_turn = True
        meeting_point = None
        
        while forward_fringe and backward_fringe:
            if forward_turn:
                # Forward search step
                if not forward_fringe:
                    break
                node = forward_fringe.pop(0)
                
                # Check if this node was visited by backward search (meeting point!)
                if node.name in backward_visited:
                    meeting_point = node.name
                    break
                
                # Mark as visited from forward direction and show it
                if node.name != source.name:
                    self.set_node_state(self.graph[node.name], "visited")
                    yield  # Yield after marking to show the node
                
                # Expand forward
                for child_name in node.children.keys():
                    if child_name not in forward_visited:
                        forward_visited[child_name] = node.name
                        child_node = self.graph[child_name]
                        forward_fringe.append(child_node)
                
            else:
                # Backward search step
                if not backward_fringe:
                    break
                node = backward_fringe.pop(0)
                
                # Check if this node was visited by forward search (meeting point!)
                if node.name in forward_visited:
                    meeting_point = node.name
                    break
                
                # Mark as visited from backward direction and show it
                if node.name != goal_node.name:
                    self.set_node_state(self.graph[node.name], "visited")
                    yield  # Yield after marking to show the node
                
                # Expand backward (MUCH faster using the map)
                for parent_name in predecessors[node.name]:
                    if parent_name not in backward_visited:
                        backward_visited[parent_name] = node.name
                        backward_fringe.append(self.graph[parent_name])
            
            forward_turn = not forward_turn
        
        # Reconstruct path if meeting point found
        if meeting_point:
            # Build forward path: start → meeting_point
            forward_path = []
            current = meeting_point
            while current is not None:
                forward_path.append(current)
                current = forward_visited.get(current)
            forward_path.reverse()
            
            # Build backward path: meeting_point → goal
            backward_path = []
            current = backward_visited.get(meeting_point)
            while current is not None:
                backward_path.append(current)
                current = backward_visited.get(current)
            
            # Combine paths
            full_path = forward_path + backward_path
            
            # Create result node with full path
            result_node = Node.copy_from(
                goal_node,
                cost=len(full_path) - 1,
                path=full_path[:-1]  # Exclude goal from path
            )
            
            self.finished("success", result_node)
            return
        
        self.finished("failed", source)

    ################################################
    ########		Utility Functions		########
    ################################################

    @property
    def dimensions(self):
        return self.__dimensions

    @property
    def agent_status(self):
        return self.__agent_status

    @property
    def is_agent_searching(self):
        return self.__agent_status == "searching"

    # Reserve the agent and prevent starting new alogorithms while searching
    def reserve_agent(self):
        if self.__agent_status == "searching":
            return False
        self.__agent_status = "searching"
        self.nodes_visited = 0  # Reset counter at start of search
        return True

    # To reset the grid to its initial state
    def reset_graph(self):
        for node_name, node in self.graph.items():
            self.graph[node_name].state = self.graph[node_name].state if self.graph[node_name].state in [
                "source", "goal"] else "empty"

    # The state of a certain node
    def node_state(self, node):
        return self.graph[node.name].state

    def set_node_state(self, node, state):
        # Track visited nodes
        if state == "visited" and self.graph[node.name].state != "visited":
            self.nodes_visited += 1
        # Debug: log state changes so frontend can show them in console
        try:
            print(f"set_node_state: node={node.name} -> {state}")
        except Exception:
            # Fall back if node has no name attribute
            print(f"set_node_state: setting state to {state}")
        self.graph[node.name].state = state

    # Checks whether the state is the goal state (goal)
    def is_goal_state(self, node):
        return self.node_state(node) == "goal"

    # Expand a node to its valid new states
    def expand(self, node):
        # Sort children alphabetically to ensure leftmost-first traversal
        return [Node.copy_from(self.graph[name], cost=node.cost + node.children[name], path=node.path + [node.name]) for name in sorted(node.children.keys())]

    # Return actual cost
    def cost(self, node):
        return node.cost

    # Retuen Heuristic
    def heuristic(self, node):
        return node.heuristic

    # Get the source node (start state)
    @property
    def source(self):
        return self.graph[0]

    # Finished with "success" or "failed"
    def finished(self, result, goal):
        self.__agent_status = result
        if result == "failed":
            self.graph[goal.name].state = "source"
            return

        # Mark solution path in the graph and log it
        try:
            print(f"finished: result={result}, goal={goal.name}, path={goal.path}")
        except Exception:
            print(f"finished: result={result}")

        for node_name in goal.path[0:]:
            self.graph[node_name].state = "path"
        if len(goal.path) > 0:
            self.graph[goal.path[0]].state = "source"
