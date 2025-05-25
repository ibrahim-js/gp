import axios from "@/api/axios-instance";

export const fetchProjects = async (options) => {
  const response = await axios.post(`/projects/e-archive-53-2023`, options);

  return response.data;
};

export const fetchProjects2 = async (options) => {
  const response = await axios.post(`/projects/e-archive-18-2022`, options);

  return response.data;
};

export const fetchProjectById = async (id) => {
  const response = await axios.get(`/projects/e-archive-53-2023/${id}`);

  return response.data;
};

export const fetchProjectFiles = async (id) => {
  const response = await axios.get(`/projects/e-archive-53-2023/${id}/files`);

  return response.data;
};

export const fetchProject2ById = async (id) => {
  const response = await axios.get(`/projects/e-archive-18-2022/${id}`);

  return response.data;
};

export const fetchProject2Files = async (id) => {
  const response = await axios.get(`/projects/e-archive-18-2022/${id}/files`);

  return response.data;
};

export const uploadFiles = async (formData, projectType) => {
  const response = await axios.post(
    `/upload?projectType=${projectType}`,
    formData
  );

  return response.data;
};

export const deleteProjectFile = async (fileId) => {
  const response = await axios.delete(
    `/projects/e-archive-53-2023/files/${fileId}`
  );

  return response.data;
};

export const deleteProject2File = async (fileId) => {
  const response = await axios.delete(
    `/projects/e-archive-18-2022/files/${fileId}`
  );

  return response.data;
};

export const updateProject = async (project) => {
  const response = await axios.put(
    `/projects/e-archive-53-2023/${project.id}`,
    project
  );

  return response.data;
};

export const updateProject2 = async (project) => {
  const response = await axios.put(
    `/projects/e-archive-18-2022/${project.id}`,
    project
  );

  return response.data;
};

export const addProject = async (project) => {
  const response = await axios.post(`/projects/e-archive-53-2023/add`, project);

  return response.data;
};

export const addProject2 = async (project) => {
  const response = await axios.post(`/projects/e-archive-18-2022/add`, project);

  return response.data;
};

export const deleteProject = async (projectId) => {
  const response = await axios.delete(
    `/projects/e-archive-53-2023/${projectId}`
  );

  return response.data;
};

export const deleteProject2 = async (projectId) => {
  const response = await axios.delete(
    `/projects/e-archive-18-2022/${projectId}`
  );

  return response.data;
};

export const fetchPendingProjects = async () => {
  const response = await axios.get(`/projects/pending`);

  return response.data;
};

export const countPendingProjects = async () => {
  const response = await axios.get(`/projects/pending/count`);

  return response.data;
};

export const approveProjectApi = async (data) => {
  const response = await axios.post(`/projects/approve`, data);

  return response.data;
};

export const rejectProjectApi = async (data) => {
  const response = await axios.post(`/projects/reject`, data);

  return response.data;
};

export const fetchRejectedProjects = async () => {
  const response = await axios.get(`/projects/rejected`);

  return response.data;
};
