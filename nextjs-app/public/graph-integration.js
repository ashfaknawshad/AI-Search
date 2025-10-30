// Save/Load functionality for AI Search Visualizer
(function() {
  'use strict';

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const graphDataStr = urlParams.get('graphData');
  const graphId = urlParams.get('graphId');
  const readOnly = urlParams.get('readOnly') === 'true';

  // Store graph ID if editing
  window.currentGraphId = graphId;
  window.isReadOnly = readOnly;
  
  // Track if graph has been saved
  let hasUnsavedChanges = false;
  let initialGraphState = null;

  // Function to get current graph data from canvas
  function getGraphData() {
    try {
      // Call Python function to get the graph state as JSON string
      if (window.getGraphStateForSave) {
        const jsonString = window.getGraphStateForSave();
        
        // Parse the JSON string to get a plain JavaScript object
        const graphState = JSON.parse(jsonString);
        
        return graphState;
      } else {
        console.error('getGraphStateForSave function not found');
      }
    } catch (error) {
      console.error('Error getting graph data:', error);
      console.error(error.stack);
    }
    return null;
  }

  // Function to load graph data into canvas
  function loadGraphData(graphData) {
    try {
      if (window.loadGraphStateFromSave && graphData) {
        window.loadGraphStateFromSave(graphData);
        console.log('Graph loaded successfully');
      } else {
        console.error('loadGraphStateFromSave function not found or no data provided');
      }
    } catch (error) {
      console.error('Error loading graph data:', error);
    }
  }

  // Function to generate thumbnail from canvas
  function generateThumbnail() {
    try {
      // Get the Fabric.js canvas
      const fabricCanvas = window.canvas;
      if (!fabricCanvas) {
        console.error('Canvas not found for thumbnail generation');
        return null;
      }

      // Generate a data URL from the canvas
      // Use JPEG for smaller file size, quality 0.7 is a good balance
      const thumbnailDataURL = fabricCanvas.toDataURL({
        format: 'jpeg',
        quality: 0.7,
        multiplier: 0.3 // Scale down to 30% for smaller thumbnail
      });

      console.log('Thumbnail generated, size:', thumbnailDataURL.length, 'characters');
      return thumbnailDataURL;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  }

  // Add Back button or Read-Only indicator (top-left corner)
  function addBackButton() {
    if (readOnly) {
      // In read-only mode, show indicator instead of back button
      const indicator = document.createElement('div');
      indicator.id = 'read-only-indicator';
      indicator.innerHTML = '<i data-lucide="eye"></i><span>Read-Only Mode</span>';
      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #ffffff;
        color: #1e293b;
        border: 1px solid #e2e8f0;
        padding: 10px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      `;
      
      document.body.appendChild(indicator);
      
      // Re-initialize Lucide icons
      if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
      }
      
      console.log('Read-only indicator added');
      return;
    }

    // Normal edit mode - back button is now in the toolbar (main.py handles this)
    // No need to create a separate back button here anymore
    
    console.log('Back button added');
  }

  // Save button is now in the toolbar (main.py handles this)
  // No need to create a separate save button here anymore
  
  // Handle save button click
  function handleSave() {
    const graphData = getGraphData();
    
    if (!graphData) {
      alert('Unable to get graph data. Please try again.');
      return;
    }

    // Generate thumbnail
    const thumbnail = generateThumbnail();
    console.log('Thumbnail generated for save:', thumbnail ? thumbnail.substring(0, 50) + '...' : 'null');

    // Send message to parent window (Next.js app)
    window.parent.postMessage({
      type: 'SAVE_GRAPH',
      data: {
        graphData: graphData,
        graphId: window.currentGraphId
      },
      thumbnail: thumbnail
    }, '*');
    
    // Mark as saved
    hasUnsavedChanges = false;
    initialGraphState = JSON.stringify(graphData);
  }

  // Expose handleSave to window so it can be called from toolbar button
  window.handleSave = handleSave;

  // Load graph data if provided in URL
  if (graphDataStr) {
    try {
      const graphData = JSON.parse(decodeURIComponent(graphDataStr));
      console.log('Graph data from URL:', graphData);
      // Store initial state
      initialGraphState = JSON.stringify(graphData);
      hasUnsavedChanges = false;
      // Wait for Brython and canvas to be ready
      setTimeout(() => {
        loadGraphData(graphData);
      }, 2000);
    } catch (error) {
      console.error('Error parsing graph data:', error);
    }
  }

  // Disable editing tools in read-only mode
  if (readOnly) {
    setTimeout(() => {
      const toolbar = document.querySelector('.floating-toolbar');
      if (toolbar) {
        // Hide the entire toolbar for a clean read-only view
        toolbar.style.display = 'none';

        // Ensure the active tool in the visualizer itself is 'move_node'
        // so clicking the canvas doesn't create nodes.
        try {
          const addBtn = document.getElementById('add_node');
          const moveBtn = document.getElementById('move_node');
          if (addBtn) addBtn.classList.remove('active');
          if (moveBtn) {
            // Add active class visually (in case toolbar is later shown)
            moveBtn.classList.add('active');
            // Programmatically trigger the click to notify Brython handlers
            moveBtn.click();
          }
          console.log('Toolbar hidden and move tool selected for read-only mode');
        } catch (e) {
          console.warn('Error setting move tool in read-only mode', e);
        }
      }

      // Read-only indicator is now in top-left (handled by addBackButton)
    }, 500);
  }

  // Initialize when DOM is ready
  console.log('Graph integration script loaded');
  console.log('Read-only mode:', readOnly);
  console.log('Graph ID:', graphId);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('DOM loaded, waiting 1 second to add buttons...');
      setTimeout(function() {
        addBackButton();
        // addSaveButton(); // Now in toolbar
      }, 1000);
    });
  } else {
    console.log('DOM already loaded, waiting 1 second to add buttons...');
    setTimeout(function() {
      addBackButton();
      // addSaveButton(); // Now in toolbar
    }, 1000);
  }

  // Track changes to the graph
  function trackChanges() {
    if (readOnly) return;
    
    let previousChangeState = false;
    
    // Initialize the initial state after canvas is ready
    setTimeout(() => {
      if (!initialGraphState && !graphDataStr) {
        // For new graphs, capture initial empty state
        const emptyState = getGraphData();
        if (emptyState) {
          initialGraphState = JSON.stringify(emptyState);
          console.log('Initial empty state captured for new graph');
        }
      }
    }, 1000);
    
    // Set up interval to check for changes
    setInterval(() => {
      const currentState = getGraphData();
      let currentlyHasChanges = false;
      
      if (currentState && initialGraphState) {
        const currentStateStr = JSON.stringify(currentState);
        if (currentStateStr !== initialGraphState) {
          currentlyHasChanges = true;
          
          // Debug: Log the difference
          if (currentStateStr.length !== initialGraphState.length) {
            console.log('State changed - length difference:', currentStateStr.length, 'vs', initialGraphState.length);
          } else {
            // Find first difference
            for (let i = 0; i < currentStateStr.length; i++) {
              if (currentStateStr[i] !== initialGraphState[i]) {
                console.log('State changed at position', i, '- current:', currentStateStr.substring(i, i + 50), 'initial:', initialGraphState.substring(i, i + 50));
                break;
              }
            }
          }
        }
      }
      
      hasUnsavedChanges = currentlyHasChanges;
      
      // Notify parent window if state changed
      if (currentlyHasChanges !== previousChangeState) {
        console.log('Change state updated:', currentlyHasChanges ? 'HAS CHANGES' : 'NO CHANGES');
        window.parent.postMessage({
          type: 'HAS_UNSAVED_CHANGES',
          hasChanges: currentlyHasChanges
        }, '*');
        previousChangeState = currentlyHasChanges;
      }
    }, 2000); // Check every 2 seconds
  }
  
  // Start tracking after canvas is ready
  setTimeout(trackChanges, 3000);

  // Prevent accidental page reload/close with unsaved changes
  window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges && !readOnly) {
      e.preventDefault();
      // Chrome requires returnValue to be set
      e.returnValue = '';
      return '';
    }
  });

  // Listen for messages from parent (if needed for future features)
  window.addEventListener('message', function(event) {
    if (event.data.type === 'SAVE_SUCCESS') {
      // Mark as saved after successful save
      hasUnsavedChanges = false;
      const currentData = getGraphData();
      if (currentData) {
        initialGraphState = JSON.stringify(currentData);
      }
      // Notify parent that changes are now saved
      window.parent.postMessage({
        type: 'HAS_UNSAVED_CHANGES',
        hasChanges: false
      }, '*');
    } else if (event.data.type === 'SAVE_ERROR') {
      alert('Error saving graph: ' + event.data.error);
    }
  });

})();
