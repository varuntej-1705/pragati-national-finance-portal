const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function fetchOverviewKPIs() {
  const res = await fetch(`${API_BASE_URL}/admin/overview`);
  return res.json();
}

export async function fetchAllPartners() {
  const res = await fetch(`${API_BASE_URL}/admin/partners`);
  return res.json();
}

export async function fetchAllSchemes() {
  const res = await fetch(`${API_BASE_URL}/admin/schemes`);
  return res.json();
}
