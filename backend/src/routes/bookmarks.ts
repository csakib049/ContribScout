import { Router, Response } from "express";
import { AuthedRequest, requireAuth } from "../middleware/requireAuth";
import { pool } from "../db/pool";


const router = Router();

router.use(requireAuth);


//GET /api/bookmarks  -- list current user's bookmerked repos
router.get('/', async (req: AuthedRequest, res: Response) => {
    const result = await pool.query(
        `SELECT r.* FROM bookmarks b
     JOIN repositories r ON r.id = b.repository_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
        [req.userId]
    );
    res.json({ data: result.rows });
});


//POST /api/bookmarks/:repositoryId - add a bookmark
router.post('/:repositoryId', async (req: AuthedRequest, res: Response) => {
    const repositoryId = Number(req.params.repositoryId);
    if (isNaN(repositoryId)) return res.status(400).json({ error: 'Invalid repository ID' });
    await pool.query(
        `INSERT INTO bookmarks (user_id, repository_id) VALUES ($1, $2)
     ON CONFLICT (user_id, repository_id) DO NOTHING`,
        [req.userId, repositoryId]
    );
    res.status(201).json({ ok: true });
})


//DELETE /api/bookmarks/:repositoryId - remove a bookmark
router.delete('/:repositoryId', async (req: AuthedRequest, res: Response) => {
    const repositoryId = Number(req.params.repositoryId);
    if (isNaN(repositoryId)) return res.status(400).json({ error: 'Invalid repository ID' });

    await pool.query(
        `DELETE FROM bookmarks WHERE user_id = $1 AND repository_id = $2`,
        [req.userId, repositoryId]
    );
    res.json({ ok: true });
});



export default router; 
