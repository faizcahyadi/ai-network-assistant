import pandas as pd
import numpy as np


# ==========================================
# 1. Load dataset normal
# ==========================================

df = pd.read_csv("../data/network_telemetry.csv")
df["timestamp"] = pd.to_datetime(df["timestamp"])


# ==========================================
# 2. Copy dataset
# ==========================================

df_anomaly = df.copy()

# Kolom untuk menandai kondisi data
df_anomaly["is_anomaly"] = 0
df_anomaly["anomaly_type"] = "normal"


# ==========================================
# 3. Random seed
# ==========================================

np.random.seed(42)


print("Dataset normal :", len(df))
print("Dataset anomaly:", len(df_anomaly))


# ==========================================
# 4. CPU Overload Anomaly
# ==========================================

device = "R-009"

start_time = pd.Timestamp("2026-09-04 10:00:00")
end_time = pd.Timestamp("2026-09-04 10:30:00")

mask = (
    (df_anomaly["device_id"] == device)
    & (df_anomaly["timestamp"] >= start_time)
    & (df_anomaly["timestamp"] <= end_time)
)

df_anomaly.loc[mask, "cpu_usage"] = np.random.uniform(
    90, 99, mask.sum()
)

df_anomaly.loc[mask, "is_anomaly"] = 1
df_anomaly.loc[mask, "anomaly_type"] = "cpu_overload"


print("\nCPU Overload:")
print("Device :", device)
print("Rows   :", mask.sum())


# ==========================================
# 5. Check CPU Overload
# ==========================================

print("\nData CPU Overload:")

print(
    df_anomaly[
        (df_anomaly["device_id"] == "R-009")
        & (df_anomaly["is_anomaly"] == 1)
    ][
        [
            "timestamp",
            "device_id",
            "cpu_usage",
            "is_anomaly",
            "anomaly_type"
        ]
    ]
)


# ==========================================
# 6. Traffic Spike Anomaly
# ==========================================

device = "R-004"

start_time = pd.Timestamp("2026-09-06 14:00:00")
end_time = pd.Timestamp("2026-09-06 14:30:00")

mask = (
    (df_anomaly["device_id"] == device)
    & (df_anomaly["timestamp"] >= start_time)
    & (df_anomaly["timestamp"] <= end_time)
)

df_anomaly.loc[mask, "bandwidth"] = np.random.uniform(
    90, 100, mask.sum()
)

df_anomaly.loc[mask, "is_anomaly"] = 1
df_anomaly.loc[mask, "anomaly_type"] = "traffic_spike"


print("\nTraffic Spike:")
print("Device :", device)
print("Rows   :", mask.sum())


# ==========================================
# 7. Network Degradation Anomaly
# ==========================================

device = "R-006"

start_time = pd.Timestamp("2026-09-03 19:00:00")
end_time = pd.Timestamp("2026-09-03 19:30:00")

mask = (
    (df_anomaly["device_id"] == device)
    & (df_anomaly["timestamp"] >= start_time)
    & (df_anomaly["timestamp"] <= end_time)
)

# Bandwidth menurun
df_anomaly.loc[mask, "bandwidth"] = np.random.uniform(
    10, 20, mask.sum()
)

# Latency meningkat
df_anomaly.loc[mask, "latency"] = np.random.uniform(
    100, 150, mask.sum()
)

# Packet loss meningkat
df_anomaly.loc[mask, "packet_loss"] = np.random.uniform(
    3, 5, mask.sum()
)

df_anomaly.loc[mask, "is_anomaly"] = 1
df_anomaly.loc[mask, "anomaly_type"] = "network_degradation"


print("\nNetwork Degradation:")
print("Device :", device)
print("Rows   :", mask.sum())


# ==========================================
# 8. Save anomaly dataset
# ==========================================

output_path = "../data/network_telemetry_anomaly.csv"

df_anomaly.to_csv(output_path, index=False)

print("\nDataset anomaly berhasil disimpan:")
print(output_path)
print("Total rows:", len(df_anomaly))
print("Total anomaly:", df_anomaly["is_anomaly"].sum())


# ==========================================
# 9. Anomaly Summary
# ==========================================

print("\nAnomaly Summary:")
print(
    df_anomaly[df_anomaly["is_anomaly"] == 1]
    ["anomaly_type"]
    .value_counts()
)


# ==========================================
# 10. Compare Normal vs Anomaly
# ==========================================

normal_data = df_anomaly[df_anomaly["is_anomaly"] == 0]
anomaly_data = df_anomaly[df_anomaly["is_anomaly"] == 1]

metrics = [
    "bandwidth",
    "latency",
    "packet_loss",
    "cpu_usage",
    "memory_usage"
]

print("\nNormal vs Anomaly:")
print("\nNORMAL:")
print(normal_data[metrics].mean().round(2))

print("\nANOMALY:")
print(anomaly_data[metrics].mean().round(2))