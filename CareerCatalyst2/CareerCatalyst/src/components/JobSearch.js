import React, { useState } from 'react';
import axios from 'axios';

function JobSearch() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:5000/get_jobs', {
        params: { role, location, type }
      });
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div>
      <h2>Job Aggregator</h2>
      <input placeholder="Job Role" value={role} onChange={e => setRole(e.target.value)} />
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <select value={type} onChange={e => setType(e.target.value)}>
        <option value="">Select Type</option>
        <option value="Full-Time">Full-Time</option>
        <option value="Internship">Internship</option>
      </select>
      <button onClick={handleSearch}>Search Jobs</button>

      <div>
        {jobs.map((job, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{job.title}</h3>
            <p>{job.company} - {job.location}</p>
            <p>Type: {job.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JobSearch;
