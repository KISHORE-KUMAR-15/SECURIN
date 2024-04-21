import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DetailsPage = () => {
  const { id } = useParams(); 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/cves/${id}`);
        setDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchData();

    return () => {
      setDetails(null);
      setLoading(true);
    };
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!details) {
    return <div>Error fetching details</div>;
  }

  const description = details.descriptions[0] || {}; 
  const descriptionValue = description.value || "No description available"; 
  const baseSeverity =
    details.metrics?.[0]?.cvssMetricV2?.[0]?.baseSeverity || "Not available";
  const score =
    details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData?.baseScore ||
    "Not available";
  const vecString =
    details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData?.vectorString ||
    "Not available";

  return (
    <div className="details_cont">
      <h1> {id}</h1>
      <h2>Description: </h2>
      <p>{descriptionValue}</p>
      <h2>cvss v2 metrices:</h2>
      <div className="severity-container">
        <p>
          <strong>severity:</strong> {baseSeverity}
        </p>
        <p>
          <strong>score:</strong> {score}
        </p>
      </div>
      <p>
        <strong>vectorScore : </strong>
        {vecString}
      </p>
      <table>
        <thead>
          <tr>
            <th>Access Control </th>
            <th>Access Complexity </th>
            <th>Authentication</th>
            <th>Confidentiality impact</th>
            <th>Integrity impact</th>
            <th>Availability impact</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData?.accessVector}
            </td>
            <td>
              {
                details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData
                  ?.accessComplexity
              }
            </td>
            <td>
              {
                details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData
                  ?.authentication
              }
            </td>
            <td>
              {
                details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData
                  ?.confidentialityImpact
              }
            </td>
            <td>
              {
                details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData
                  ?.integrityImpact
              }
            </td>
            <td>
              {
                details.metrics?.[0]?.cvssMetricV2?.[0]?.cvssData
                  ?.availabilityImpact
              }
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Scores :</h2>
      <p>
        <strong>Exploitability Score :</strong>{" "}
        {details.metrics?.[0]?.cvssMetricV2?.[0]?.exploitabilityScore}{" "}
      </p>
      <p>
        <strong>Impact Score :</strong>{" "}
        {details.metrics?.[0]?.cvssMetricV2?.[0]?.impactScore}{" "}
      </p>
      <h2>CPE : </h2>
      <table>
        <thead>
          <tr>
            <td>Criteria</td>
            <td>Match Criteria</td>
            <td>Vulnerable</td>
          </tr>
        </thead>
        <tbody>
          {details.configurations.map((configuration) =>
            configuration.nodes.map((node) =>
              node.cpeMatch.map((match) => (
                <tr key={match._id}>
                  <td>{match.criteria}</td>
                  <td>{match.matchCriteriaId}</td>
                  <td>{match.vulnerable ? "Yes" : "No"}</td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DetailsPage;
