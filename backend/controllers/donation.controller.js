const Donation = require("../models/donation.model");
const Sponsorship = require("../models/sponsorship.model");

// Monetary donations controllers
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find();
    res.status(200).json(donations);
  } catch (error) {
    console.error("Get donations error:", error);
    res.status(500).json({ message: "Server error fetching donations" });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }
    res.status(200).json(donation);
  } catch (error) {
    console.error("Get donation error:", error);
    res.status(500).json({ message: "Server error fetching donation" });
  }
};

exports.createDonation = async (req, res) => {
  try {
    if (!req.body.donor || !req.body.donor.name) {
      return res.status(400).json({ message: "donor.name is required." });
    }
    const newDonation = new Donation(req.body);
    await newDonation.save();
    res.status(201).json(newDonation);
  } catch (error) {
    console.error("Create donation error:", error);
    res.status(500).json({ message: "Server error creating donation" });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json(updatedDonation);
  } catch (error) {
    console.error("Update donation error:", error);
    res.status(500).json({ message: "Server error updating donation" });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);

    if (!deletedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Delete donation error:", error);
    res.status(500).json({ message: "Server error deleting donation" });
  }
};

// Sponsorships controllers
exports.getAllSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().populate("childId");
    res.status(200).json(sponsorships);
  } catch (error) {
    console.error("Get sponsorships error:", error);
    res.status(500).json({ message: "Server error fetching sponsorships" });
  }
};

exports.getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id).populate(
      "childId"
    );
    if (!sponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }
    res.status(200).json(sponsorship);
  } catch (error) {
    console.error("Get sponsorship error:", error);
    res.status(500).json({ message: "Server error fetching sponsorship" });
  }
};

exports.createSponsorship = async (req, res) => {
  try {
    const newSponsorship = new Sponsorship(req.body);
    await newSponsorship.save();

    const populatedSponsorship = await Sponsorship.findById(
      newSponsorship._id
    ).populate("childId");

    res.status(201).json(populatedSponsorship);
  } catch (error) {
    console.error("Create sponsorship error:", error);
    res.status(500).json({ message: "Server error creating sponsorship" });
  }
};

exports.updateSponsorship = async (req, res) => {
  try {
    const updatedSponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("childId");

    if (!updatedSponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.status(200).json(updatedSponsorship);
  } catch (error) {
    console.error("Update sponsorship error:", error);
    res.status(500).json({ message: "Server error updating sponsorship" });
  }
};

exports.deleteSponsorship = async (req, res) => {
  try {
    const deletedSponsorship = await Sponsorship.findByIdAndDelete(
      req.params.id
    );

    if (!deletedSponsorship) {
      return res.status(404).json({ message: "Sponsorship not found" });
    }

    res.status(200).json({ message: "Sponsorship deleted successfully" });
  } catch (error) {
    console.error("Delete sponsorship error:", error);
    res.status(500).json({ message: "Server error deleting sponsorship" });
  }
};
