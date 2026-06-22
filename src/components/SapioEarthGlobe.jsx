"use client";

import { useEffect } from "react";
import SuperGlobeEngine from "./EarthGlobe/SuperGlobeEngine.js";

export default function SapioEarthGlobe({
  instanceId = "sapio-home-globe",
  variant = "default",
  showHelper = false
}) {
  const canvasId = `${instanceId}-canvas`;
  const sidebarId = `${instanceId}-sidebar`;
  const titleId = `${instanceId}-sidebar-title`;
  const contentId = `${instanceId}-sidebar-content`;
  const closeButtonId = `${instanceId}-sidebar-close`;

  useEffect(() => {
    const engine = new SuperGlobeEngine(canvasId, sidebarId, {
      titleId,
      contentId,
      closeButtonId
    });

    return () => {
      if (engine?.renderer) {
        engine.renderer.dispose();
      }
    };
  }, [canvasId, sidebarId, titleId, contentId, closeButtonId]);

  return (
    <div className={`globe-showcase-container sapio-home-globe sapio-globe-${variant}`}>
      <div className="globe-canvas-frame">
        <canvas
          id={canvasId}
          className="globe-canvas"
          width="720"
          height="720"
          aria-label="Interactive 3D SapioMatch study destination globe"
        />
      </div>

      {showHelper && (
        <p className="globe-helper-text">
          Drag to rotate. Hover or click a glowing country marker to open the partner directory.
        </p>
      )}

      <div id={sidebarId} className="globe-sidebar" aria-label="Partner institution directory">
        <div className="globe-sidebar-header">
          <h3 className="globe-sidebar-title" id={titleId}>
            <span>Global Directory</span>
          </h3>
          <button className="globe-sidebar-close" id={closeButtonId} aria-label="Close directory sidebar">
            &times;
          </button>
        </div>
        <div className="globe-sidebar-content" id={contentId} />
      </div>
    </div>
  );
}
