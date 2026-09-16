import { Router } from "express";
import { listRepositories,getRepository,getRepositoryIssues } from "../controllers/repositories";


const router = Router();

router.get('/',listRepositories);
router.get('/:id',getRepository);
router.get('/:id/issues',getRepositoryIssues);


export default router;



