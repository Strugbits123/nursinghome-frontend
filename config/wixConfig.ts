import { createClient, OAuthStrategy } from "@wix/sdk";
import { items, collections } from "@wix/data";
import { submissions } from "@wix/forms";
import { posts } from "@wix/blog";

if (!process.env.WIX_CLIENT_ID) throw new Error("Env not found");

const wixClient = createClient({
  modules: { collections, items, submissions, posts },
  auth: OAuthStrategy({ clientId: process.env.WIX_CLIENT_ID }),
});

export default wixClient;