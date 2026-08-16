/**
 * Fabric.js Helper Functions
 * Utilities for common canvas operations
 */
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique ID for canvas objects
 */
export function generateObjectId(prefix: string = "obj"): string {
  return `${prefix}_${uuidv4().split("-")[0]}`;
}

/**
 * Draw a grid on the canvas
 */
export function drawGrid(canvas: any, gridSize: number = 20) {
  const width = canvas.width!;
  const height = canvas.height!;

  // Remove existing grid lines
  const existingGrid = canvas.getObjects().filter((o: any) => o.data?.isGrid);
  existingGrid.forEach((o: any) => canvas.remove(o));

  // We'll use the fabric module dynamically
  import("fabric").then(({ Line }) => {
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: "rgba(200, 200, 200, 0.3)",
        strokeWidth: x % (gridSize * 5) === 0 ? 0.8 : 0.3,
        selectable: false,
        evented: false,
        data: { isGrid: true },
      });
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: "rgba(200, 200, 200, 0.3)",
        strokeWidth: y % (gridSize * 5) === 0 ? 0.8 : 0.3,
        selectable: false,
        evented: false,
        data: { isGrid: true },
      });
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    canvas.renderAll();
  });
}

/**
 * Remove grid from canvas
 */
export function removeGrid(canvas: any) {
  const gridObjects = canvas.getObjects().filter((o: any) => o.data?.isGrid);
  gridObjects.forEach((o: any) => canvas.remove(o));
  canvas.renderAll();
}

/**
 * Snap an object to grid
 */
export function snapObjectToGrid(obj: any, gridSize: number = 20) {
  const left = Math.round(obj.left / gridSize) * gridSize;
  const top = Math.round(obj.top / gridSize) * gridSize;
  obj.set({ left, top });
  obj.setCoords();
}

/**
 * Center an object on the canvas
 */
export function centerObject(canvas: any, obj: any) {
  const canvasCenter = {
    x: canvas.width! / 2,
    y: canvas.height! / 2,
  };
  obj.set({
    left: canvasCenter.x - (obj.width! * (obj.scaleX || 1)) / 2,
    top: canvasCenter.y - (obj.height! * (obj.scaleY || 1)) / 2,
  });
  obj.setCoords();
  canvas.renderAll();
}

/**
 * Setup zoom with mouse wheel
 */
export function setupZoom(canvas: any, onZoomChange: (zoom: number) => void) {
  canvas.on("mouse:wheel", (opt: any) => {
    const delta = opt.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    zoom = Math.max(0.1, Math.min(5, zoom));
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    onZoomChange(zoom);
  });
}

/**
 * Setup pan with middle mouse button or space + drag
 */
export function setupPan(canvas: any) {
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;
  let spacePressed = false;

  // Track space key for space+drag panning
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && !spacePressed) {
      spacePressed = true;
      canvas.defaultCursor = "grab";
      canvas.selection = false;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      spacePressed = false;
      canvas.defaultCursor = "default";
      canvas.selection = true;
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  canvas.on("mouse:down", (opt: any) => {
    const evt = opt.e;
    // Middle mouse button or space + left click
    if (evt.button === 1 || (spacePressed && evt.button === 0)) {
      isPanning = true;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.defaultCursor = "grabbing";
    }
  });

  canvas.on("mouse:move", (opt: any) => {
    if (isPanning) {
      const evt = opt.e;
      const vpt = canvas.viewportTransform!;
      vpt[4] += evt.clientX - lastPosX;
      vpt[5] += evt.clientY - lastPosY;
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      canvas.requestRenderAll();
    }
  });

  canvas.on("mouse:up", () => {
    isPanning = false;
    if (!spacePressed) {
      canvas.defaultCursor = "default";
    } else {
      canvas.defaultCursor = "grab";
    }
  });

  // Cleanup function
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  };
}

/**
 * Setup smart alignment guides
 */
export function setupAlignmentGuides(canvas: any) {
  const guideLines: any[] = [];
  const SNAP_THRESHOLD = 5;

  const clearGuides = () => {
    guideLines.forEach((line) => canvas.remove(line));
    guideLines.length = 0;
  };

  canvas.on("object:moving", (e: any) => {
    clearGuides();
    const activeObj = e.target;
    if (!activeObj) return;

    const objCenter = activeObj.getCenterPoint();
    const objLeft = activeObj.left;
    const objTop = activeObj.top;
    const objRight = objLeft + activeObj.getScaledWidth();
    const objBottom = objTop + activeObj.getScaledHeight();

    // Canvas center guides
    const canvasCenterX = canvas.width! / 2;
    const canvasCenterY = canvas.height! / 2;

    import("fabric").then(({ Line }) => {
      // Vertical center guide
      if (Math.abs(objCenter.x - canvasCenterX) < SNAP_THRESHOLD) {
        activeObj.set("left", canvasCenterX - activeObj.getScaledWidth() / 2);
        const line = new Line([canvasCenterX, 0, canvasCenterX, canvas.height!], {
          stroke: "#ff4757",
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
        });
        canvas.add(line);
        guideLines.push(line);
      }

      // Horizontal center guide
      if (Math.abs(objCenter.y - canvasCenterY) < SNAP_THRESHOLD) {
        activeObj.set("top", canvasCenterY - activeObj.getScaledHeight() / 2);
        const line = new Line([0, canvasCenterY, canvas.width!, canvasCenterY], {
          stroke: "#ff4757",
          strokeWidth: 1,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
        });
        canvas.add(line);
        guideLines.push(line);
      }

      canvas.renderAll();
    });
  });

  canvas.on("object:modified", () => {
    clearGuides();
    canvas.renderAll();
  });
}

/**
 * Align selected objects
 */
export function alignObjects(
  canvas: any,
  alignment: "left" | "center" | "right" | "top" | "middle" | "bottom"
) {
  const activeSelection = canvas.getActiveObject();
  if (!activeSelection) return;

  // Single object → align to canvas
  if (activeSelection.type !== "activeSelection") {
    const obj = activeSelection;
    switch (alignment) {
      case "left":
        obj.set("left", 0);
        break;
      case "center":
        obj.set("left", (canvas.width! - obj.getScaledWidth()) / 2);
        break;
      case "right":
        obj.set("left", canvas.width! - obj.getScaledWidth());
        break;
      case "top":
        obj.set("top", 0);
        break;
      case "middle":
        obj.set("top", (canvas.height! - obj.getScaledHeight()) / 2);
        break;
      case "bottom":
        obj.set("top", canvas.height! - obj.getScaledHeight());
        break;
    }
    obj.setCoords();
    canvas.renderAll();
    return;
  }

  // Multiple objects
  const objects = activeSelection.getObjects();
  const bounds = activeSelection.getBoundingRect();

  objects.forEach((obj: any) => {
    switch (alignment) {
      case "left":
        obj.set("left", bounds.left);
        break;
      case "center":
        obj.set("left", bounds.left + bounds.width / 2 - obj.getScaledWidth() / 2);
        break;
      case "right":
        obj.set("left", bounds.left + bounds.width - obj.getScaledWidth());
        break;
      case "top":
        obj.set("top", bounds.top);
        break;
      case "middle":
        obj.set("top", bounds.top + bounds.height / 2 - obj.getScaledHeight() / 2);
        break;
      case "bottom":
        obj.set("top", bounds.top + bounds.height - obj.getScaledHeight());
        break;
    }
    obj.setCoords();
  });

  canvas.renderAll();
}
