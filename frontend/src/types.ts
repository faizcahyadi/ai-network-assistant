export interface Incident {
  incident_id: string;
  device_id: string;
  severity: string;
  anomaly_type: string;
  start_time: string;
  end_time: string;
  root_cause: string;
  evidence: string;
  ai_analysis: string;
}