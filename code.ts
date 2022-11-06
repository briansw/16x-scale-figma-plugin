// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 380, height: 198, title: "16x scale" });

// Trigger any time an element is selected
figma.on("selectionchange", () => { 
  const node = figma.currentPage.selection[0];
  
  if (node !== undefined && "resize" in node) {
    figma.ui.postMessage({
      width: node.width,
      height: node.height
    });
  }

})

figma.ui.onmessage = msg => {  
  if (msg.type === 'add') {
    const nodes: SceneNode[] = [];
    const bounds = figma.viewport.bounds;
    const rect = figma.createRectangle();

    var scaled_width = (msg.width * 16),
        scaled_height = (msg.height * 16);

    rect.resize(scaled_width, scaled_height);
    rect.x = bounds.x;
    rect.y = bounds.y;

    rect.fills = [{type: 'SOLID', color: {r: 0, g: 1, b: 0}}];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);

    figma.currentPage.selection = nodes;
    // figma.viewport.scrollAndZoomIntoView(nodes);
    
  } else if (msg.type === 'edit') {
    
    // resize selected rects to new dims

    var scaled_width  = (msg.width * 16), 
        scaled_height = (msg.height * 16),
        dim_to_edit   = msg.dim_to_edit;

    for (const node of figma.currentPage.selection) {
      if ("resize" in node) {
        if (dim_to_edit == 'both') {
          node.resize(scaled_width, scaled_height);
        } else if (dim_to_edit == 'width') {
          node.resize(scaled_width, node.height);
        } else if (dim_to_edit == 'height') {
          node.resize(node.width, scaled_height);
        }
        
      }
    }
    
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
