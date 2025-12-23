import HelpRequest from '../models/HelpRequest.js';
import SupportGroup from '../models/SupportGroup.js';

// 1. Create a New Request
export const createRequest = async (req, res) => {
  try {
    const { supportGroupId, requesterName, contact, location, urgency, message } = req.body;

    // Optional: Check if group exists
    const group = await SupportGroup.findByPk(supportGroupId);
    if (!group) return res.status(404).json({ error: 'Support Group not found' });

    const newRequest = await HelpRequest.create({
      supportGroupId,
      requesterName,
      contact,
      location,
      urgency,
      message
    });

    res.status(201).json({ message: 'Request sent successfully', data: newRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send request' });
  }
};

// 2. Get Requests (Optional: For Admin Dashboard later)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.findAll({
      include: [{ model: SupportGroup, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 3. Update Request Status (e.g. Move to "In Progress")
 export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Expects 'Pending', 'In Progress', or 'Resolved'
    
    const request = await HelpRequest.findByPk(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    request.status = status;
    await request.save();

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// 4. Delete Request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await HelpRequest.destroy({ where: { id } });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};