import express from 'express';
const router = express.Router();
import { createRequest, getAllRequests,
    updateStatus, deleteRequest
 } from '../controller/requestController.js';

router.post('/', createRequest);
router.get('/', getAllRequests); // Useful for admin panel later
router.put('/:id',updateStatus); // <--- NEW
router.delete('/:id',deleteRequest); // <--- NEW
export default router;