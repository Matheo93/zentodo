import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zen Todo - Minimalist Task Manager",
    short_name: "ZenTodo",
    description: "A zen-like todo app. No distractions. Just you and your tasks.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f1a",
    theme_color: "#6366f1",
    orientation: "portrait",
    categories: ["productivity", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
