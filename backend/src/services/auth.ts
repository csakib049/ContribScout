import jwt from 'jsonwebtoken';
import { env } from '../config/env';



interface GitHubTokenResponse {
    access_token?: string;
    error?: string;
}

interface GitHubUserProfile {
    id: number;
    login: string;
    avatar_url: string;
}



export async function exchangeCodeForToken(code: string): Promise<string> {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            client_id: env.githubClientId,
            client_secret: env.githubClientSecret,
            code,
            redirect_uri: env.githubCallbackUrl,
        }),
    });
    const data: GitHubTokenResponse = await res.json();
    if (!data.access_token) throw new Error(data.error || 'Failed to get access token from github.');
    return data.access_token;
}


export async function fetchGitHubProfile(accessToken: string): Promise<GitHubUserProfile> {
  const res = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch GitHub profile: ${res.status}`);
  return res.json();
}


export interface JwtPayload{
    userId:number;
    githubId:number;
    username:string;
}


export function signJwt(payload:JwtPayload):string{
    return jwt.sign(payload,env.jwtSecret,{expiresIn:'7d'}); 
}


export function verifyJwt(token:string):JwtPayload{
    return jwt.verify(token,env.jwtSecret) as JwtPayload;
}