import {
  OAuthRequestError,
  providerUserAuth,
  validateOAuth2AuthorizationCode,
} from "@lucia-auth/oauth";
import { auth } from "../../../lib/lucia";

import type { APIRoute } from "astro";

export const get: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect("/", 302); // redirect to profile page
  }
  const storedState = context.cookies.get("oauth_state")?.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }
  try {
    const tokens = await validateOAuth2AuthorizationCode<{
      access_token: string;
    }>(code, import.meta.env.CLERK_TOKEN_ENDPOINT, {
      redirectUri: import.meta.env.CLERK_CALLBACK_URL,
      clientId: import.meta.env.CLERK_CLIENT_ID,
      clientPassword: {
        authenticateWith: "client_secret",
        clientSecret: import.meta.env.CLERK_CLIENT_SECRET,
      },
    });
    const response = await fetch(import.meta.env.CLERK_USER_INFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });
    const clerkUser: ClerkUserResponse = await response.json();
    const { getExistingUser, createUser } = providerUserAuth(auth, "clerk", clerkUser.user_id)

    const getUser = async () => {
    	const existingUser = await getExistingUser();
    	if (existingUser) return existingUser;
    	const user = await createUser({
    		attributes: {
    			username: clerkUser.username
    		}
    	});
    	return user;
    };
    const user = await getUser();
    const session = await auth.createSession({
    	userId: user.userId,
    	attributes: {}
    });
    context.locals.auth.setSession(session);
    return context.redirect("/", 302); // redirect to profile page
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      console.log(e.request.url);
      console.log(await e.response.json());
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    console.log(e);
    return new Response(null, {
      status: 500,
    });
  }
};

interface ClerkUserResponse {
  object: string;
  instance_id: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  username: string;
  picture: string;
  user_id: string;
}
