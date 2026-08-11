import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_portfolio_item",
  title: "Create portfolio item",
  description: "Add a new portfolio item to the photography site (admin only).",
  inputSchema: {
    title: z.string().trim().min(1).describe("Title of the portfolio item."),
    image_url: z.string().url().describe("Public URL of the image."),
    description: z.string().trim().nullable().describe("Optional description."),
    category: z.string().trim().nullable().describe("Optional category."),
    display_order: z.number().int().nullable().describe("Optional sort position."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, image_url, description, category, display_order }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        title,
        image_url,
        description: description ?? null,
        category: category ?? null,
        display_order: display_order ?? null,
      })
      .select();
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data?.[0] ?? null) }],
          structuredContent: { item: data?.[0] ?? null },
        };
  },
});
