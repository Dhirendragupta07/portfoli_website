import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_experience_entries",
  title: "List experience entries",
  description: "List the photographer's experience/timeline entries.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(50).describe("Maximum number of entries to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("experience_entries")
      .select("id,year,title,description,display_order")
      .order("display_order", { ascending: true })
      .limit(limit ?? 50);
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { entries: data ?? [] },
        };
  },
});
