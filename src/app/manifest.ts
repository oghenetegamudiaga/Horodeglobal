import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Horode Design Studio",
    short_name: "Horode",
    description:
      "Strategic branding, UI/UX design, and custom software engineering studio.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#111111",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
