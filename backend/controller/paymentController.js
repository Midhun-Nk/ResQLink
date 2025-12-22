import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';
import Donation from '../models/Donation.js';
// 1. Create Order
export const createOrder = async (req, res) => {
  try {
    const { amount, donorName } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay takes amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Save pending donation to DB
    await Donation.create({
      donorName: donorName || 'Anonymous',
      amount: amount,
      orderId: order.id,
      status: 'pending'
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// 2. Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Update DB to success
      const donation = await Donation.findOne({ where: { orderId: razorpay_order_id } });
      if (donation) {
        donation.paymentId = razorpay_payment_id;
        donation.status = 'success';
        await donation.save();
      }
      
      res.json({ status: 'success', message: 'Payment verified' });
    } else {
      res.status(400).json({ status: 'failed', message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }
};