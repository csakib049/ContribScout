import {env} from '../config/env';

const GITHUB_API = 'https://api.github.com';


function headers() {
  return {
    Authorization: `Bearer ${env.githubToken}`,
    Accept: 'application/vnd.github+json',
  };
}


