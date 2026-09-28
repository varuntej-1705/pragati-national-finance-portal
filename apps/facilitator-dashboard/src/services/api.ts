const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function matchCitizenSchemes(payload: any) {
  const res = await fetch(`${API_BASE_URL}/match/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function locateNearbyPartners(payload: any) {
  const res = await fetch(`${API_BASE_URL}/partners/locate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
