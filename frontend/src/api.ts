import type { Incident } from "./types";

const API_BASE = "http://127.0.0.1:8000";

export async function getIncidents(): Promise<Incident[]> {
  const response = await fetch(`${API_BASE}/incidents`);
  handleErrorResponse(response);
  return response.json();
}

export async function getIncident(id: string): Promise<Incident> {
  const response = await fetch(`${API_BASE}/incidents/${id}`);
  handleErrorResponse(response);
  return response.json();
}

function handleErrorResponse(response: Response): void {
  if (response.status === 404) {
    throw new Error("Incident not found");
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
