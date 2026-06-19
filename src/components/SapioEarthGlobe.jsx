"use client";

import { useEffect } from "react";
import SuperGlobeEngine from "./EarthGlobe/SuperGlobeEngine.js";

export default function SapioEarthGlobe() {
  useEffect(() => {
    const engine = new SuperGlobeEngine("sapio-home-globe-canvas", "sapio-home-globe-sidebar");

    return () => {
      if (engine?.renderer) {
        engine.renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="globe-showcase-container sapio-home-globe">
      <div className="globe-canvas-frame">
        <canvas
          id="sapio-home-globe-canvas"
          className="globe-canvas"
          width="720"
          height="720"
          aria-label="Interactive 3D SapioMatch study destination globe"
        />
      </div>

      <div id="sapio-home-globe-sidebar" className="globe-sidebar" aria-label="Partner institution directory">
        <div className="globe-sidebar-header">
          <h3 className="globe-sidebar-title" id="globe-sidebar-title-heading">
            <span>Global Directory</span>
          </h3>
          <button className="globe-sidebar-close" id="globe-sidebar-close-btn" aria-label="Close directory sidebar">
            &times;
          </button>
        </div>
        <div className="globe-sidebar-content" id="globe-sidebar-content-area" />
      </div>
    </div>
  );
}
