#!/usr/bin/env python3
"""
Convert raw Gill/MaxiMet GMX550 log output into a CSV with descriptive headers.

Usage:
    python gmx550_log_to_csv.py input_log.txt
    python gmx550_log_to_csv.py input_log.txt -o output.csv

The script looks for lines containing the GMX550 data payload that begins with:
    Q,DIR,SPEED,CDIR,CSPEED,PRESS,RH,TEMP,DEWPOINT,GPSLOCATION,TIME,VOLT,STATUS,CHECK

It handles STX/ETX control characters and preserves the trailing checksum.
"""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Dict, Iterable, List, Optional


FIELDNAMES = [
    "node_letter",
    "wind_direction_deg",
    "wind_speed_m_s",
    "corrected_wind_direction_deg",
    "corrected_wind_speed_m_s",
    "pressure_hPa",
    "relative_humidity_percent",
    "air_temperature_C",
    "dewpoint_C",
    "gps_location_raw",
    "gps_latitude_deg",
    "gps_longitude_deg",
    "gps_height_m",
    "station_timestamp_utc",
    "supply_voltage_V",
    "status_code",
    "checksum_hex",
]


def safe_int(value: str) -> Optional[int]:
    value = value.strip()
    return int(value) if value else None


def safe_float(value: str) -> Optional[float]:
    value = value.strip()
    return float(value) if value else None


def parse_gps(
    gps_value: str,
) -> tuple[Optional[float], Optional[float], Optional[float]]:
    parts = gps_value.split(":")
    if len(parts) != 3:
        return None, None, None
    lat, lon, elev = parts
    return safe_float(lat), safe_float(lon), safe_float(elev)


def parse_payload_line(raw_line: str) -> Optional[Dict[str, object]]:
    """
    Parse one raw log line containing a GMX550 payload.
    Returns a dict suitable for CSV writing, or None if the line is not parseable.
    """
    if "Q," not in raw_line:
        print("Q not in raw line")
        return None

    line = raw_line.strip()
    # Split and remove empty fields created by the ETX replacement.
    parts = [p.strip() for p in line.split(",")]
    parts = [p for p in parts if p != ""]

    # Expected payload after cleanup:
    # NODE,DIR,SPEED,CDIR,CSPEED,PRESS,RH,TEMP,DEWPOINT,GPSLOCATION,TIME,VOLT,STATUS,CHECK
    # units:
    # -,DEG,MS,DEG,MS,HPA,%,C,C,-,-,V,-,-
    if len(parts) < 14:
        print("Not enough parts: ", len(parts))
        return None

    parts = parts[:14]

    (
        node,
        wind_dir,
        wind_speed,
        corrected_dir,
        corrected_speed,
        pressure,
        rel_humidity,
        air_temp,
        dewpoint,
        gps_location,
        timestamp,
        voltage,
        status,
        checksum,
    ) = parts

    lat, lon, elev = parse_gps(gps_location)

    return {
        "node_letter": node,
        "wind_direction_deg": safe_int(wind_dir),
        "wind_speed_m_s": safe_float(wind_speed),
        "corrected_wind_direction_deg": safe_int(corrected_dir),
        "corrected_wind_speed_m_s": safe_float(corrected_speed),
        "pressure_hPa": safe_float(pressure),
        "relative_humidity_percent": safe_float(rel_humidity),
        "air_temperature_C": safe_float(air_temp),
        "dewpoint_C": safe_float(dewpoint),
        "gps_location_raw": gps_location,
        "gps_latitude_deg": lat,
        "gps_longitude_deg": lon,
        "gps_height_m": elev,
        "station_timestamp_utc": timestamp,
        "supply_voltage_V": safe_float(voltage),
        "status_code": status,
        "checksum_hex": checksum,
    }


def parse_file(input_path: Path) -> List[Dict[str, object]]:
    rows: List[Dict[str, object]] = []
    with input_path.open("r", encoding="utf-8", errors="ignore") as f:
        for line in f:
            parsed = parse_payload_line(line)
            if parsed is not None:
                rows.append(parsed)
    return rows


def default_output_path(input_path: Path) -> Path:
    return input_path.with_name(f"{input_path.stem}_descriptive.csv")


def write_csv(rows: Iterable[Dict[str, object]], output_path: Path) -> None:
    with output_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(rows)


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Convert GMX550 raw log output to CSV with descriptive column names."
    )
    parser.add_argument("input_log", type=Path, help="Path to raw GMX550 log file")
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output CSV path (default: <input_stem>_descriptive.csv)",
    )
    return parser


def main() -> int:
    parser = build_arg_parser()
    args = parser.parse_args()

    input_path: Path = args.input_log
    if not input_path.exists():
        parser.error(f"Input file does not exist: {input_path}")

    output_path = args.output if args.output else default_output_path(input_path)

    rows = parse_file(input_path)
    print(rows[1])
    if not rows:
        parser.error(
            "No GMX550 payload lines were found. Expected lines containing 'Q,' "
            "with the MaxiMet payload."
        )

    write_csv(rows, output_path)
    print(f"Wrote {len(rows)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
