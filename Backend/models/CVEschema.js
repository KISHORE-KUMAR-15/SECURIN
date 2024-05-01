// models/cveModel.js

const mongoose = require("mongoose");

const cveSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  sourceIdentifier: {
    type: String,
    required: true,
  },
  published: {
    type: Date,
    required: true,
  },
  lastModified: {
    type: Date,
    required: true,
  },
  vulnStatus: {
    type: String,
    required: true,
  },
  descriptions: [
    {
      lang: String,
      value: String,
    },
  ],
  metrics: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
  weaknesses: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
  configurations: [
    {
      nodes: [
        {
          operator: String,
          negate: Boolean,
          cpeMatch: [
            {
              vulnerable: Boolean,
              criteria: String,
              matchCriteriaId: String,
            },
          ],
        },
      ],
    },
  ],
  references: [
    {
      type: mongoose.Schema.Types.Mixed,
    },
  ],
});

const CVE = mongoose.model("CVENew", cveSchema);

module.exports = CVE;
