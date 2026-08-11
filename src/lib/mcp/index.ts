import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listPortfolioItems from "./tools/list-portfolio-items";
import createPortfolioItem from "./tools/create-portfolio-item";
import listGalleryImages from "./tools/list-gallery-images";
import listExperienceEntries from "./tools/list-experience-entries";
import listContactMessages from "./tools/list-contact-messages";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "code-converter-hub",
  title: "Code Converter Hub",
  version: "0.1.0",
  instructions:
    "Tools for the KNOXS photography site. Read and manage portfolio items, gallery images, experience entries, and contact messages as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listPortfolioItems,
    createPortfolioItem,
    listGalleryImages,
    listExperienceEntries,
    listContactMessages,
  ],
});
