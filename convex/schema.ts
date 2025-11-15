import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  orders: defineTable({
    fullName: v.string(),
    grade: v.string(),
    serviceType: v.string(),
    fileName: v.optional(v.string()),
    fileId: v.optional(v.id("_storage")),
    fileSize: v.optional(v.number()),
    pageCount: v.optional(v.number()),
    price: v.number(),
    status: v.string(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
