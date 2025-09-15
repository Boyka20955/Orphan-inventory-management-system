const express = require("express");
const router = express.Router();
const donationController = require("../controllers/donation.controller");
const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Donation routes
router.get("/", authMiddleware.verifyToken, donationController.getAllDonations);
router.get(
  "/:id",
  authMiddleware.verifyToken,
  donationController.getDonationById
);
router.post("/", authMiddleware.verifyToken, donationController.createDonation);
router.put(
  "/:id",
  authMiddleware.verifyToken,
  donationController.updateDonation
);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  donationController.deleteDonation
);

// Sponsorship routes
router.get(
  "/sponsorships",
  authMiddleware.verifyToken,
  donationController.getAllSponsorships
);
router.get(
  "/sponsorships/:id",
  authMiddleware.verifyToken,
  donationController.getSponsorshipById
);
router.post(
  "/sponsorships",
  authMiddleware.verifyToken,
  donationController.createSponsorship
);
router.put(
  "/sponsorships/:id",
  authMiddleware.verifyToken,
  donationController.updateSponsorship
);
router.delete(
  "/sponsorships/:id",
  authMiddleware.verifyToken,
  donationController.deleteSponsorship
);

// Reports routes
router.get(
  "/reports/donations",
  authMiddleware.verifyToken,
  reportController.getDonationReports
);
router.get(
  "/reports/sponsorships",
  authMiddleware.verifyToken,
  reportController.getSponsorshipReports
);

module.exports = router;
