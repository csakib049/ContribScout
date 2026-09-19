
import { Router, Request, Response } from 'express';
import { pool } from '../db/pool';
import { env } from '../config/env';
import { exchangeCodeForToken, fetchGitHubProfile, signJwt, verifyJwt } from '../services/auth';


const router = Router();

//step A: redirect user to the Github's authorize page
router.get('/github', (req: Request, res: Response) => {
    const params = new URLSearchParams({
        client_id: env.githubClientId,
        redirect_uri: env.githubCallbackUrl,
        scope: 'read:user',
    });
    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});


//step B: Github redirects back here with a ?code = 
router.get('/github/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('Missing code form Github');

    try {
        const accessToken = await exchangeCodeForToken(code);
        const profile = await fetchGitHubProfile(accessToken);

        const result = await pool.query(
            `INSERT INTO users (github_id, username, avatar_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (github_id) DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url
       RETURNING id`,
            [profile.id, profile.login, profile.avatar_url]
        );

        const userId = result.rows[0].id;

        const token = signJwt({ userId, githubId: profile.id, username: profile.login });


        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect(env.frontendUrl);

    } catch (err) {
        console.error(err);
        res.status(500).send("OAuth login failed");
    }
});



//check who's currently logged in 
router.get('/me', (req: Request, res: Response) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not logged in" });
    try {
        const payload = verifyJwt(token);
        res.json({ user: payload });
    } catch {
        res.status(401).json({ error: 'Invalid or expired session.' });
    }
});

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ ok: true });
});


export default router;