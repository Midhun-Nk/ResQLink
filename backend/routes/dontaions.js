import express from 'express';
const dontaionRoute = express.Router();
import { createOrder, verifyPayment } from '../controller/paymentController.js';
import { getStats } from '../controller/statsController.js';
// Payment Routes
dontaionRoute.post('/create-order', createOrder);
dontaionRoute.post('/verify-payment', verifyPayment);

// Stats Routes
dontaionRoute.get('/stats', getStats);

export default dontaionRoute;