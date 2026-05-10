import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Broomba",
    short_name: "Broomba",
    description:
      "A personality-driven AI roommate that catches mess drift before life gets annoying.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8fe",
    theme_color: "#550ee7",
  };
}
