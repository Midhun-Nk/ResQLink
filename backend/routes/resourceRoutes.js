import express from 'express';

import { getAllResources, createResource, fulfillResource
, updateRequest, deleteRequest, makeContribution,getPendingContributions,rejectContribution,approveContribution
 } from '../controller/resourceController.js';
const ResourceRoute = express.Router();
ResourceRoute.get('/', getAllResources);
ResourceRoute.post('/', createResource);
ResourceRoute.post('/contribute', makeContribution); // <--- User Pledge Route
ResourceRoute.put('/:id/fulfill', fulfillResource); // Route to update count
// --- NEW ADMIN ROUTES ---
ResourceRoute.put('/:id', updateRequest);   // Edit details
ResourceRoute.delete('/:id', deleteRequest); // Delete

// Admin Approval Routes
ResourceRoute.get('/contributions/pending', getPendingContributions);
ResourceRoute.put('/contributions/:id/approve', approveContribution);
ResourceRoute.put('/contributions/:id/reject', rejectContribution);

export default ResourceRoute;