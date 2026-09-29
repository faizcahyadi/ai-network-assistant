from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from pathlib import Path


class Incident(BaseModel):
    incident_id: str
    device_id: str
    severity: str
    anomaly_type: str
    start_time: str
    end_time: str
    root_cause: str
    evidence: str
    ai_analysis: str


app = FastAPI(
    title="AI Network Troubleshooting Assistant"
)


DATA_PATH = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "incident_result.json"
)


@app.get("/")
def root():
    return {
        "message": "AI Network Troubleshooting Assistant API"
    }


@app.get("/incidents", response_model=list[Incident])
def get_incidents():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        incidents = json.load(f)

    return incidents


@app.get("/incidents/{incident_id}", response_model=Incident)
def get_incident(incident_id: str):
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        incidents = json.load(f)

    for incident in incidents:
        if incident["incident_id"] == incident_id:
            return incident

    raise HTTPException(
        status_code=404,
        detail="Incident not found"
    )