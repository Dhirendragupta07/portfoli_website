import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_contact_messages",
  title: "List contact messages",
  description: "List contact form messages received by the site (admin only).",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum number of messages to return."),
    only_unread: z.boolean().default(false).describe("Return only unread messages."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, only_unread }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("contact_messages")
      .select("id,name,email,message,is_read,created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (only_unread) query = query.eq("is_read", false);
    const { data, error } = await query;
    return error
      ? { content: [{ type: "text", text: error.message }], isError: true }
      : {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: { messages: data ?? [] },
        };
  },
});
