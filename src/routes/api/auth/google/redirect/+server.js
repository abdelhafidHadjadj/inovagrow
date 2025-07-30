import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';




const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/auth/google/callback`
);

export async function GET() {
  const url = client.generateAuthUrl({
    scope: ['profile', 'email'],
    prompt: 'select_account'
  });
  throw redirect(302, url);
}
