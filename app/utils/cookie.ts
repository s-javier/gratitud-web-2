import { createCookie } from '@remix-run/node'

export const userTokenCookie = createCookie('token', {
  domain:
    process.env.NODE_ENV === 'development'
      ? 'localhost'
      : (process.env.PUBLIC_BASE_URL?.split('https://')[1] ?? ''),
  path: '/',
  /* ↓ Prevenir el acceso a las cookies a través de JS. Esto ayuda a mitigar los ataques de XSS donde un atacante podría intentar robar cookies */
  httpOnly: true,
  /* ↓ Cookie solo se envíe a través de conexiones seguras (HTTPS) */
  secure: process.env.NODE_ENV === 'production',
  /* ↓ Controlar el envío de cookies con solicitudes entre sitios. Esto ayuda a proteger contra ataques de CSRF */
  // sameSite: request.headers.get('host')?.startsWith('localhost') ? false : 'strict',
  sameSite: 'strict',
  /* ↓ Segundos. 5 días - 10 minutos */
  maxAge: Number(process.env.SESSION_DAYS) * 24 * 60 * 60 - 10 * 60,
})
