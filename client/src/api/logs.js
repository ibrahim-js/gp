import axios from "@/api/axios-instance";

export async function fetchLogs({ page = 1, limit = 2, searchQuery = "" }) {
  const response = await axios.get("/logs", {
    params: {
      page,
      limit,
      searchQuery,
    },
  });

  return response.data;
}

export async function logAction(data) {
  await axios.post("/logs", data);
}
