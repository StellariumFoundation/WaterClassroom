import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

/**
 * Loads the Neue Frutiger World font via FontFace API.
 * Wraps children so they only render after font is loaded.
 */
export const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handle = delayRender("Loading Neue Frutiger World font");

    const font = new FontFace(
      "Neue Frutiger World",
      `url(${staticFile("neue_frutiger_world_regular.ttf")}) format('truetype')`,
      { weight: "400", style: "normal" }
    );

    font
      .load()
      .then((loadedFont: FontFace) => {
        document.fonts.add(loadedFont);
        setLoaded(true);
        continueRender(handle);
      })
      .catch((err: unknown) => {
        console.warn("Failed to load Neue Frutiger World font, using fallback:", err);
        setLoaded(true);
        continueRender(handle);
      });
  }, []);

  // Render hidden until font is ready, then show
  return <div style={{ opacity: loaded ? 1 : 0 }}>{children}</div>;
};
