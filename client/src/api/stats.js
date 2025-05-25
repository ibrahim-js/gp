import axios from "@/api/axios-instance";

export async function fetchDashboardStats() {
  const response = await axios.get("/stats/dashboard");

  return response.data;
}
