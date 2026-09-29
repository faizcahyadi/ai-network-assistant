import pandas as pd
import numpy as np


# ==========================================
# CONFIGURATION
# ==========================================

NUM_DEVICES = 10
DAYS = 7
INTERVAL_MINUTES = 5

START_DATE = "2026-09-01 00:00:00"

np.random.seed(42)


# ==========================================
# TIMESTAMP
# ==========================================

timestamps = pd.date_range(
    start=START_DATE,
    periods=(DAYS * 24 * 60) // INTERVAL_MINUTES,
    freq=f"{INTERVAL_MINUTES}min"
)


# ==========================================
# DEVICE PROFILE
# ==========================================

device_profiles = {}

for device_number in range(1, NUM_DEVICES + 1):

    device_id = f"R-{device_number:03d}"

    device_profiles[device_id] = {
        "bandwidth_base": np.random.uniform(40, 60),
        "latency_base": np.random.uniform(25, 35),
        "cpu_base": np.random.uniform(30, 45),
        "memory_base": np.random.uniform(40, 60),
    }


# ==========================================
# GENERATE TELEMETRY
# ==========================================

data = []

for device_id, profile in device_profiles.items():

    for timestamp in timestamps:

        hour = timestamp.hour

        # ----------------------------------
        # TIME OF DAY EFFECT
        # ----------------------------------

        if 8 <= hour < 18:
            traffic_factor = 1.20

        elif 18 <= hour < 22:
            traffic_factor = 1.05

        elif 0 <= hour < 6:
            traffic_factor = 0.75

        else:
            traffic_factor = 0.90


        # ----------------------------------
        # BANDWIDTH
        # ----------------------------------

        bandwidth = (
            profile["bandwidth_base"]
            * traffic_factor
            + np.random.normal(0, 4)
        )

        bandwidth = np.clip(
            bandwidth,
            5,
            100
        )


        # ----------------------------------
        # CPU USAGE
        # ----------------------------------

        cpu_usage = (
            profile["cpu_base"]
            + (bandwidth - profile["bandwidth_base"]) * 0.25
            + np.random.normal(0, 5)
        )

        cpu_usage = np.clip(
            cpu_usage,
            0,
            100
        )


        # ----------------------------------
        # LATENCY
        # ----------------------------------

        latency = (
            profile["latency_base"]
            + max(bandwidth - 60, 0) * 0.35
            + np.random.normal(0, 3)
        )

        latency = np.clip(
            latency,
            1,
            200
        )


        # ----------------------------------
        # PACKET LOSS
        # ----------------------------------

        packet_loss = (
            0.3
            + max(bandwidth - 65, 0) * 0.02
            + np.random.normal(0, 0.12)
        )

        packet_loss = np.clip(
            packet_loss,
            0,
            5
        )


        # ----------------------------------
        # MEMORY USAGE
        # ----------------------------------

        memory_usage = (
            profile["memory_base"]
            + np.random.normal(0, 3)
        )

        memory_usage = np.clip(
            memory_usage,
            0,
            100
        )


        data.append({
            "timestamp": timestamp,
            "device_id": device_id,
            "bandwidth": round(bandwidth, 2),
            "latency": round(latency, 2),
            "packet_loss": round(packet_loss, 2),
            "cpu_usage": round(cpu_usage, 2),
            "memory_usage": round(memory_usage, 2),
        })


# ==========================================
# DATAFRAME
# ==========================================

df = pd.DataFrame(data)


# ==========================================
# SAVE DATASET
# ==========================================

output_path = "data/network_telemetry.csv"

df.to_csv(
    output_path,
    index=False
)


# ==========================================
# INFORMATION
# ==========================================

print("Dataset berhasil dibuat.")
print(f"Jumlah data   : {len(df)}")
print(f"Jumlah device : {df['device_id'].nunique()}")
print(f"Output        : {output_path}")

print("\nPreview dataset:")
print(df.head())