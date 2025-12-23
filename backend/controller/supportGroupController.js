import SupportGroup from '../models/SupportGroup.js';
import  { Op } from 'sequelize';

// 1. Get All Groups (with Search & Filter)
export const getGroups = async (req, res) => {
  try {
    const { search, type } = req.query;
    let whereClause = {};

    // Search Logic (Name or Location)
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by Type
    if (type && type !== 'All') {
      whereClause.type = type;
    }

    const groups = await SupportGroup.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create Group
export const createGroup = async (req, res) => {
  try {
    const group = await SupportGroup.create(req.body);
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Update Group (e.g., Change Status)
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await SupportGroup.update(req.body, { where: { id } });
    if (updated) {
      const updatedGroup = await SupportGroup.findByPk(id);
      res.json(updatedGroup);
    } else {
      res.status(404).json({ error: 'Group not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete Group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SupportGroup.destroy({ where: { id } });
    if (deleted) res.json({ message: 'Group deleted' });
    else res.status(404).json({ error: 'Group not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};