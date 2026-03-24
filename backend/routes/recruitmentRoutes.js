const express = require("express");
const { buildAndCallApollo } = require("../services/apolloService");

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const formData = req.body || {};
    const people = await buildAndCallApollo(formData);

    return res.status(200).json({
      success: true,
      data: people || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Apollo search failed",
    });
  }
});

module.exports = router;
