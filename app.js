import { serve } from "https://deno.land/std@0.222.1/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";

import * as chatService from "./services/chatService.js";


configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
    return new Response(`Redirecting to ${path}`, {
        status: 303,
        headers: {
            "Location": path,
        },
    });
};

const addChatMessage = async (request) => {
    const formData = await request.formData();
    const message = formData.get("message");
    const sender = formData.get("sender");
    await chatService.addChatMessage(sender,message);
    return redirectTo("/");
};
const getChatMessages = async () => {
    try {
        const messages = await chatService.getChatMessages();
        const data = { messages: messages || [] }; // Ensure messages is always an array
        return new Response(await renderFile("index.eta", data), responseDetails);
    } catch (error) {
        console.error("Error getting chat messages:", error);
        return new Response("Error retrieving messages", { status: 500 });
    }
};

const handleRequest = async (request) => {
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "POST") {
        return await addChatMessage(request);

    } else if (url.pathname === "/" && request.method === "GET") {
        return await getChatMessages();
    } else {
        return new Response("Not found", { status: 404 });
    }
};
serve(handleRequest, { port: 7777 });
