
const Donation = require('../models/donation.model');
const Sponsorship = require('../models/sponsorship.model');
const Child = require('../models/child.model');
const HealthRecord = require('../models/healthRecord.model');

// Get donation reports
exports.getDonationReports = async (req, res) => {
  try {
    // Get all monetary donations
    const donations = await Donation.find({ type: 'monetary' });
    
    // Calculate total donations by month for the current year
    const currentYear = new Date().getFullYear();
    const monthlyDonations = Array(12).fill(0);
    
    donations.forEach(donation => {
      const donationDate = new Date(donation.donationDate);
      if (donationDate.getFullYear() === currentYear) {
        const month = donationDate.getMonth();
        monthlyDonations[month] += donation.amount || 0;
      }
    });
    
    // Calculate total donations
    const totalDonation = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    
    // Calculate average donation
    const avgDonation = donations.length > 0 ? totalDonation / donations.length : 0;
    
    // Get donor statistics
    const uniqueDonors = new Set(donations.map(donation => donation.donor.name)).size;
    
    res.status(200).json({
      monthlyDonations,
      totalDonation,
      avgDonation,
      uniqueDonors,
      donationCount: donations.length
    });
  } catch (error) {
    console.error('Get donation reports error:', error);
    res.status(500).json({ message: 'Server error fetching donation reports' });
  }
};

// Get sponsorship reports
exports.getSponsorshipReports = async (req, res) => {
  try {
    // Get all sponsorships
    const sponsorships = await Sponsorship.find().populate('childId');
    
    // Calculate total sponsorship amount by month for the current year
    const currentYear = new Date().getFullYear();
    const monthlySponsorship = Array(12).fill(0);
    
    sponsorships.forEach(sponsorship => {
      const startDate = new Date(sponsorship.startDate);
      if (startDate.getFullYear() === currentYear) {
        const month = startDate.getMonth();
        monthlySponsorship[month] += sponsorship.amount || 0;
      }
    });
    
    // Calculate active vs inactive sponsorships
    const active = sponsorships.filter(s => s.status === 'active').length;
    const inactive = sponsorships.length - active;
    
    // Calculate total monthly commitment
    const monthlyCommitment = sponsorships
      .filter(s => s.status === 'active' && s.frequency === 'monthly')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    // Get children with multiple sponsors
    const childrenWithSponsors = {};
    sponsorships.forEach(s => {
      if (s.childId) {
        const childId = s.childId._id.toString();
        childrenWithSponsors[childId] = (childrenWithSponsors[childId] || 0) + 1;
      }
    });
    
    const multipleSponsors = Object.values(childrenWithSponsors).filter(count => count > 1).length;
    
    res.status(200).json({
      monthlySponsorship,
      active,
      inactive,
      monthlyCommitment,
      multipleSponsors,
      totalSponsors: sponsorships.length
    });
  } catch (error) {
    console.error('Get sponsorship reports error:', error);
    res.status(500).json({ message: 'Server error fetching sponsorship reports' });
  }
};
