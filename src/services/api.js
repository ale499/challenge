export async function getCandidateByEmail(email) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/candidate/get-by-email?email=${email}`
  );

  if (!response.ok) {
    throw new Error("Error fetching candidate data");
  }

  return response.json();
}

export async function getJobs() {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/jobs/get-list`
  );

  if (!response.ok) {
    throw new Error("Error fetching jobs");
  }

  return response.json();
}

export async function applyToJob(body) {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/api/candidate/apply-to-job`,
    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error("Error applying to job");
  }

  return response.json();
}
