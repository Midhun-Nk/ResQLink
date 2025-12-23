import ResourceContribution from '../models/ResourceContribution.js';
import  ResourceRequest from '../models/ResourceRequest.js';
import  { Op }  from 'sequelize';

// 1. Get All Requests (Search & Filter)
export const getAllResources = async (req, res) => {
  try {
    const { filter, search } = req.query;
    let whereClause = {};

    if (filter && filter !== 'All') {
      whereClause.category = filter;
    }

    if (search) {
      whereClause[Op.or] = [
        { item: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    const resources = await ResourceRequest.findAll({ 
      where: whereClause,
      order: [['createdAt', 'DESC']] 
    });
    
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// 2. Create New Request
export const createResource = async (req, res) => {
  try {
    const newRequest = await ResourceRequest.create(req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: 'Creation failed' });
  }
};

// 3. Fulfill Request (Update collected amount)
export const fulfillResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // Amount being sent

    const resource = await ResourceRequest.findByPk(id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    const newCollected = resource.collected + parseInt(amount);
    
    // Update resource
    resource.collected = newCollected;
    if (newCollected >= resource.required) {
      resource.status = 'Fulfilled';
    }
    
    await resource.save();
    res.json(resource);

  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ResourceRequest.update(req.body, { where: { id } });
    
    if (updated) {
      const updatedRequest = await ResourceRequest.findByPk(id);
      res.json(updatedRequest);
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// 5. Delete Request
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ResourceRequest.destroy({ where: { id } });
    
    if (deleted) res.json({ message: 'Request deleted' });
    else res.status(404).json({ error: 'Request not found' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};


export const makeContribution = async (req, res) => {
  try {
    const { resourceRequestId, amount, contact, donorName } = req.body;

    // Verify request exists
    const request = await ResourceRequest.findByPk(resourceRequestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Create the pledge
    const contribution = await ResourceContribution.create({
      resourceRequestId,
      amount,
      contact,
      donorName,
      status: 'Pending'
    });

    res.status(201).json({ message: 'Pledge sent to admin', data: contribution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send pledge' });
  }
};

// 4. ADMIN: Get All Pending Contributions
export const getPendingContributions = async (req, res) => {
  try {
    const pending = await ResourceContribution.findAll({
      where: { status: 'Pending' },
      include: [{ model: ResourceRequest, attributes: ['item', 'category'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// 5. ADMIN: Approve Contribution (Updates Main Stock)
export const approveContribution = async (req, res) => {
  try {
    const { id } = req.params; // Contribution ID
    
    // Find Contribution
    const contribution = await ResourceContribution.findByPk(id);
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
    
    if (contribution.status !== 'Pending') {
      return res.status(400).json({ error: 'Already processed' });
    }

    // Find Parent Request
    const resourceRequest = await ResourceRequest.findByPk(contribution.resourceRequestId);
    
    // UPDATE LOGIC: Add quantity to main request
    const newCollected = resourceRequest.collected + contribution.amount;
    resourceRequest.collected = newCollected;
    
    // Auto-complete if goal reached
    if (newCollected >= resourceRequest.required) {
      resourceRequest.status = 'Fulfilled';
    }

    // Save Changes
    await resourceRequest.save();
    
    // Update Contribution Status
    contribution.status = 'Collected';
    await contribution.save();

    res.json({ message: 'Stock updated successfully', resourceRequest });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Approval failed' });
  }
};

// 6. ADMIN: Reject Contribution
export const rejectContribution = async (req, res) => {
  try {
    const { id } = req.params;
    await ResourceContribution.update({ status: 'Rejected' }, { where: { id } });
    res.json({ message: 'Rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Reject failed' });
  }
};