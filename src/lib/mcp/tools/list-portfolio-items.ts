import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_portfolio_items",
  title: "List portfolio items",
  description: "List portfolio items from the photography site, newest first by display order.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum number of items to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id,title,description,category,image_url,display_order,created_at")
      .order("display_order", { ascending: true })
      .limit(limit ?? 20);
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { items: data ?? [] },
        };
  },
});
