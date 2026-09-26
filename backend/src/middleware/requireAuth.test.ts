import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from './requireAuth';
import * as authService from '../services/auth';

function makeReqResNext(cookies: Record<string, string> = {}) {
    const req: any = { cookies };
    const res: any = {
        statusCode: 200,
        body: null,
        status(code: number) {
            this.statusCode = code;
            return this;
        },
        json(payload: unknown) {
            this.body = payload;
            return this;
        },
    };
    const next = vi.fn();  //fake function 
    return { req, res, next };
}

describe('requireAuth', () => {


    it('returns 401 when there is no token cookie', () => {
        const { req, res, next } = makeReqResNext({}); // no "token" key at all
        requireAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Login required' });
        expect(next).not.toHaveBeenCalled();
    });



    it('returns 401 when the token is invalid', () => {
        vi.spyOn(authService, 'verifyJwt').mockImplementation(() => {
            throw new Error('invalid token');
        });

        const { req, res, next } = makeReqResNext({ token: 'garbage-token' });
        requireAuth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ error: 'Invalid or expired session' });
        expect(next).not.toHaveBeenCalled();

        vi.restoreAllMocks();
    });



    it('calls next() and attaches userId when the token is valid', () => {
        vi.spyOn(authService, 'verifyJwt').mockReturnValue({
            userId: 42,
            githubId: 123,
            username: 'testuser',
        });

        const { req, res, next } = makeReqResNext({ token: 'valid-token' });
        requireAuth(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(req.userId).toBe(42);

        vi.restoreAllMocks();
    });
});