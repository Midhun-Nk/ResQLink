import express from 'express';
import { getGroups, createGroup, updateGroup, deleteGroup } from '../controller/supportGroupController.js';
const router = express.Router();


router.get('/', getGroups);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;