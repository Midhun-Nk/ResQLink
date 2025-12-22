import { Sequelize } from 'sequelize';
 import Donation from '../models/Donation.js';
export const getStats = async (req, res) => {
  try {
    // 1. Total Raised
    const totalRaised = await Donation.sum('amount', { where: { status: 'success' } }) || 0;
    
    // 2. Total Donors
    const totalDonors = await Donation.count({ where: { status: 'success' } });
    
    // 3. Recent 4 Donations
    const recentDonations = await Donation.findAll({
      where: { status: 'success' },
      order: [['createdAt', 'DESC']],
      limit: 4,
      attributes: ['donorName', 'amount']
    });

    // 4. Chart Data (Last 7 days) 
    // Note: This is a raw query for simplicity, sequelize helper can be complex for date grouping
    const chartData = await Donation.findAll({
        attributes: [
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
            [Sequelize.fn('SUM', Sequelize.col('amount')), 'total']
        ],
        where: { status: 'success' },
        group: ['date'],
        order: [['date', 'ASC']],
        limit: 7
    });

    res.json({
      totalRaised,
      totalDonors,
      recentDonations,
      chartData: chartData.map(d => ({ name: d.dataValues.date, amount: d.dataValues.total }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};