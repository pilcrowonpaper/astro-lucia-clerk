import { createOAuth2AuthorizationUrl } from "@lucia-auth/oauth";
import type { APIRoute } from "astro";

export const get: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect("/", 302); // redirect to profile page
  }
  const [url, state] = await createOAuth2AuthorizationUrl(
    import.meta.env.CLERK_AUTHORIZE_ENDPOINT ?? "",
    {
      clientId: import.meta.env.CLERK_CLIENT_ID ?? "",
      scope: ["profile"],
    }
  );
  context.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 60 * 60,
  });
  return context.redirect(url.toString(), 302);
};
