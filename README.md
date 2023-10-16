# Clerk OAuth example with Lucia and Astro

For @bholmesdev :D. The schema should be exactly the same as the one you did in your previous stream (I think - check the user attributes). Both Lucia and Drizzle supports Cloudflare D1, good luck!

## Setup Clerk

Create a new Clerk application. Before clicking "Create application," check what auth methods you want to use (for Github, you have to click "Show 20 more"). Store the `CLERK_SECRET_KEY` (it will be hidden in the web dashboard).

### 1. Create new OAuth application

Send a CURL request to create a new OAuth application. **Make sure to update `<CLERK_SECRET_KEY>` and `"name"`.** Optionally update `"callback_url"` if you'd like to change the routes.

**HIDE THIS PART SINCE IT WILL EXPOSE YOUR SECRET IN THE RESPONSE!**

```
curl -X POST https://api.clerk.com/v1/oauth_applications \
   -H "Authorization: Bearer <CLERK_SECRET_KEY>" \
   -H "Content-Type: application/json" \
   -d '{"callback_url":"http://localhost:4321/login/clerk/callback", "name": "test"}'
```

If you mess up, you can send another request (the response will be different every time)

### 2. Setup `.env`

The JSON response should look something like this:

```json
{
  "object": "oauth_application",
  "id": "",
  "instance_id": "",
  "name": "test",
  "client_id": "",
  "client_secret": "",
  "public": false,
  "scopes": "profile email",
  "callback_url": "http://localhost:4321/login/clerk/callback",
  "authorize_url": "",
  "token_fetch_url": "",
  "user_info_url": "",
  "created_at": 1697465038088,
  "updated_at": 1697465038088
}
```

Move them to `.env`:

```bash
CLERK_CLIENT_ID=""
CLERK_CLIENT_SECRET=""
CLERK_USER_INFO_ENDPOINT=""
CLERK_AUTHORIZE_ENDPOINT=""
CLERK_TOKEN_ENDPOINT=""
CLERK_CALLBACK_URL=""
```


## Before deploying

1. This example uses SQLite in memory. Lucia provides a [D1 adapter](https://lucia-auth.com/database-adapters/cloudflare-d1/), since it's SQL, you can use the SQL statements in `schema.sql` to set it up. Remember that you cannot store booleans with D1 (use integers). Drizzle also [supports D1](https://orm.drizzle.team/docs/quick-sqlite/d1)
2. This example uses the Node.js Astro adapter
3. Create a new Clerk OAuth application (via CURL) but **update the callback_url to `https://example.com/login/clerk/callback`**
