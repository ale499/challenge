import { useEffect, useState } from "react";
import { getJobs, getCandidateByEmail, applyToJob } from "../services/api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [candidate, setCandidate] = useState(null);
  const [repoUrls, setRepoUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successJobId, setSuccessJobId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [jobsData, candidateData] = await Promise.all([
          getJobs(),
          getCandidateByEmail(import.meta.env.VITE_CANDIDATE_EMAIL),
        ]);

        setJobs(jobsData);
        setCandidate(candidateData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (jobId, value) => {
    setRepoUrls((prev) => ({
      ...prev,
      [jobId]: value,
    }));
  };

  const handleSubmit = async (jobId) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessJobId(null);

      if (!repoUrls[jobId]) {
        throw new Error("Repository URL is required");
      }

      const payload = {
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        repoUrl: repoUrls[jobId],
      };

      console.log("applyToJob payload", payload);

      await applyToJob(payload);

      setSuccessJobId(jobId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !jobs.length) return <p>Loading...</p>;
  if (error && !jobs.length) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container">
      <h1>Open Positions</h1>

      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <h3>{job.title}</h3>

          <input
            type="text"
            placeholder="https://github.com/tu-usuario/tu-repo"
            value={repoUrls[job.id] || ""}
            onChange={(e) => handleInputChange(job.id, e.target.value)}
          />

          <button onClick={() => handleSubmit(job.id)} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>

          {successJobId === job.id && (
            <p style={{ color: "green" }}>Application sent successfully!</p>
          )}
        </div>
      ))}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
