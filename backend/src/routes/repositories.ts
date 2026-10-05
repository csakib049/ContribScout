import { Router } from "express";
import { listRepositories, getRepository, getRepositoryIssues, getRepositoryFiles, searchRepositories } from "../controllers/repositories";


const router = Router();

router.get('/search',searchRepositories)
router.get('/', listRepositories);
router.get('/:id', getRepository);
router.get('/:id/issues', getRepositoryIssues);
router.get('/:id/files', getRepositoryFiles);

export default router;



