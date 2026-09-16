import { Request, Response } from 'express';
import { pool } from '../db/pool';

export async function listRepositories(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const offset = (page - 1) * limit; //how many items to skip 

    const result = await pool.query(
        `SELECT * FROM repositories ORDER BY stars DESC LIMIT $1 OFFSET $2`, [limit, offset]
    );
    res.json({ page, limit, data: result.rows });
}


export async function getRepository(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }


    const result = await pool.query(`SELECT * FROM repositories WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({
            error: `Repository not found`
        });
    }

    res.json(result.rows[0]);
}

export async function getRepositoryIssues(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    const result = await pool.query(`SELECT * FROM issues WHERE repository_id = $1`, [id]);
    res.json({ data: result.rows });
}



