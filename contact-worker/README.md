# Rafal Wilk Contact Worker

Small Cloudflare Worker for sending homepage contact form messages through Resend.

## Setup

1. Create a Resend API key.
2. Log in to Cloudflare Wrangler:

```powershell
npx wrangler login
```

3. Add the Resend secret:

```powershell
cd contact-worker
npx wrangler secret put RESEND_API_KEY
```

4. Deploy:

```powershell
npx wrangler deploy
```

5. Copy the deployed Worker URL into:

```js
window.RW_CONTACT_ENDPOINT = 'https://your-worker-url.workers.dev';
```

in `assets/js/contact-config.js`, then commit and push.

## Notes

- `CONTACT_TO` is already set to `rafalw898@gmail.com`.
- For production, verify a domain in Resend and replace `CONTACT_FROM` in `wrangler.toml`.
- Until a sending domain is verified, Resend can restrict who receives messages.
