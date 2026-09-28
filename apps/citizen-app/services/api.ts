const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function requestOtp(phone: string) {
  const res = await fetch(`${API_BASE_URL}/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return res.json();
}

export async function verifyOtp(phone: string, otp: string) {
  const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return res.json();
}

export async function guestQuickCheck() {
  const res = await fetch(`${API_BASE_URL}/auth/guest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function matchSchemes(criteria: any) {
  const res = await fetch(`${API_BASE_URL}/match/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criteria),
  });
  return res.json();
}

export async function calculateEmi(params: any) {
  const res = await fetch(`${API_BASE_URL}/calculator/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function locatePartners(query: any) {
  const res = await fetch(`${API_BASE_URL}/partners/locate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  return res.json();
}
