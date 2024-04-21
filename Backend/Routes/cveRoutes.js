const express = require("express");
const router = express.Router();
const CVE = require("../models/CVEschema"); 
const axios = require("axios");

async function fetchDataFromAPI(startIndex, pageSize) {
  const apiUrl = `https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${startIndex}&resultsPerPage=${pageSize}`;

  try {
    const response = await axios.get(apiUrl);
    return response.data.vulnerabilities.filter((vulnerability) =>
      vulnerability.hasOwnProperty("cve")
    );
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return [];
  }
}

router.get("/insert-cves", async (req, res) => {
  const pageSize = 100;
  let startIndex = 0;
  let allCVEs = [];

  try {
    let cveVulnerabilities = await fetchDataFromAPI(startIndex, pageSize);

    while (cveVulnerabilities.length > 0) {
      allCVEs = allCVEs.concat(cveVulnerabilities);
      startIndex += pageSize;
      cveVulnerabilities = await fetchDataFromAPI(startIndex, pageSize);
    }

    for (const vulnerability of allCVEs) {
      if (vulnerability.cve && vulnerability.cve.id) {
        const existingCVE = await CVE.findOne({ id: vulnerability.cve.id });
        if (!existingCVE) {
          const newCVE = new CVE(vulnerability.cve);
          await newCVE.save();
          console.log("CVE data saved:", newCVE.id);
        } else {
          console.log(
            "CVE already exists, skipping insertion:",
            vulnerability.cve.id
          );
        }
      } else {
        console.log("Invalid or missing CVE data:", vulnerability);
      }
    }

    console.log("All CVE data saved successfully.");
    res.send("All CVE data saved successfully.");
  } catch (error) {
    console.error("Error inserting CVE data into DB:", error);
    res.status(500).send("Error inserting CVE data into DB");
  }
});
router.get("/list", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const resultsPerPage = parseInt(req.query.resultsPerPage) || 10;
    const year = req.query.year;

    let query = {};
    if (year) {
      query.$or = [
        { $expr: { $eq: [{ $year: "$published" }, parseInt(year)] } },
        { $expr: { $eq: [{ $year: "$lastModified" }, parseInt(year)] } },
      ];
    }

    const startIndex = (page - 1) * resultsPerPage;

    const totalRecords = await CVE.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / resultsPerPage);

    const cves = await CVE.find(query)
      .skip(startIndex)
      .sort({ lastModified: -1 })
      .limit(resultsPerPage);

    res.json({ cves, totalRecords, totalPages });
  } catch (error) {
    console.error("Error fetching CVE data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const cveId = req.params.id;

  try {
    const cve = await CVE.findOne({ id: cveId });

    if (!cve) {
      return res.status(404).json({ error: "CVE not found" });
    }

    res.json(cve);
  } catch (error) {
    console.error("Error fetching CVE details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
