import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// File download endpoint
http.route({
  path: "/download/{fileId}",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const fileId = url.pathname.split('/').pop();
    
    try {
      // Get the file URL from storage
      const fileUrl = await ctx.runQuery(api.orders.getFileUrl, { 
        fileId: fileId as any 
      });
      
      if (!fileUrl) {
        return new Response("File not found", { status: 404 });
      }
      
      // Redirect to the file URL
      return Response.redirect(fileUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      return new Response("Error downloading file", { status: 500 });
    }
  }),
});

export default http;
