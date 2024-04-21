import React, { useState, useEffect } from "react";
import axios from "axios";

const CVEList = () => {
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(() => {
    const savedResultsPerPage = localStorage.getItem("resultsPerPage");
    return savedResultsPerPage ? parseInt(savedResultsPerPage) : 10;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    const savedPage = localStorage.getItem("currentPage");
    return savedPage ? parseInt(savedPage) : 1;
  });
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [year, setYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://localhost:4000/cves/list?page=${currentPage}&resultsPerPage=${resultsPerPage}`;
        if (year.trim() !== "") {
          url += `&year=${year}`;
        }
        const response = await axios.get(url);
        const { cves, totalRecords, totalPages } = response.data;
        if (cves) {
          setCves(cves);
          setTotalRecords(totalRecords);
          setTotalPages(totalPages);
          generatePageNumbers(totalPages);
        } else {
          console.error("No CVE data found in the response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, resultsPerPage, year]);

  useEffect(() => {
    localStorage.setItem("resultsPerPage", resultsPerPage.toString());
  }, [resultsPerPage]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const generatePageNumbers = (totalPages) => {
    const numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    setPageNumbers(numbers);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleResultsPerPageChange = (e) => {
    setResultsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="data">
        <p>Total records: {totalRecords}</p>
        <label htmlFor="resultsPerPage">Results Per Page:</label>
        <select
          id="resultsPerPage"
          value={resultsPerPage}
          onChange={handleResultsPerPageChange}
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div className="inp_box">
          <label htmlFor="yearInput">Filter by year: </label>
          <input
            id="yearInput"
            placeholder=" Enter Year"
            value={year}
            onChange={handleYearChange}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>CVE ID</th>
            <th>Identifier</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="table_body">
          {cves && cves.length > 0 ? (
            cves.map((cve) => (
              <tr
                key={cve._id}
                onClick={() => (window.location.href = `/cves/${cve.id}`)}
              >
                <td>{cve.id}</td>
                <td>{cve.sourceIdentifier}</td>
                <td>{formatDate(cve.published)}</td>
                <td>{formatDate(cve.lastModified)}</td>
                <td>{cve.vulnStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No CVEs available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="page_num">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          &lt;
        </button>
        {pageNumbers.slice(currentPage - 1, currentPage + 4).map((number) => (
          <button key={number} onClick={() => handlePageChange(number)}>
            {number}
          </button>
        ))}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default CVEList;
