const RESEND_API_URL = 'https://api.resend.com/emails';

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
    }

    try {
      const payload = await request.json();
      const clean = sanitizePayload(payload);
      const validationError = validatePayload(clean);
      if (validationError) return json({ ok: false, error: validationError }, 400, cors);

      if (!env.RESEND_API_KEY) {
        return json({ ok: false, error: 'missing_resend_api_key' }, 500, cors);
      }

      const emailResponse = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM || 'Rafal Wilk Digital Workshop <onboarding@resend.dev>',
          to: env.CONTACT_TO || 'rafalw898@gmail.com',
          reply_to: clean.email,
          subject: 'Rafal Wilk Digital Workshop - contact request',
          text: buildText(clean),
          html: buildHtml(clean)
        })
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Resend error:', errorText);
        return json({ ok: false, error: 'email_send_failed' }, 502, cors);
      }

      return json({ ok: true }, 200, cors);
    } catch (error) {
      console.error(error);
      return json({ ok: false, error: 'server_error' }, 500, cors);
    }
  }
};

function sanitizePayload(payload) {
  return {
    name: String(payload?.name || '').trim().slice(0, 120),
    email: String(payload?.email || '').trim().slice(0, 160),
    message: String(payload?.message || '').trim().slice(0, 5000),
    lang: String(payload?.lang || '').trim().slice(0, 10),
    page: String(payload?.page || '').trim().slice(0, 500)
  };
}

function validatePayload(payload) {
  if (!payload.name) return 'missing_name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) return 'invalid_email';
  if (!payload.message || payload.message.length < 3) return 'missing_message';
  return '';
}

function buildText(payload) {
  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Language: ${payload.lang || '-'}`,
    `Page: ${payload.page || '-'}`,
    '',
    payload.message
  ].join('\n');
}

function buildHtml(payload) {
  return `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#10233f">
    <h2>Rafal Wilk Digital Workshop - contact request</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Language:</strong> ${escapeHtml(payload.lang || '-')}</p>
    <p><strong>Page:</strong> ${escapeHtml(payload.page || '-')}</p>
    <hr>
    <p>${escapeHtml(payload.message).replace(/\n/g, '<br>')}</p>
  </div>`;
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = String(env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : (allowed[0] || '*');
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

function json(body, status, headers) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}
