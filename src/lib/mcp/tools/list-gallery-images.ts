import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_gallery_images",
  title: "List gallery images",
  description: "List gallery images from the photography site.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum number of images to return."),
    category: z.string().trim().nullable().describe("Optional category filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("gallery_images")
      .select("id,image_url,alt_text,category,display_order,created_at")
      .order("display_order", { ascending: true })
      .limit(limit ?? 20);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { images: data ?? [] },
        };
  },
});
