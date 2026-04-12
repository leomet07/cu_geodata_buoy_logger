from dotenv import load_dotenv
import datetime
import os
from pymongo import MongoClient, WriteConcern

load_dotenv()


mongo_client = MongoClient(os.getenv("MONGODB_URI"))
mongo_db = mongo_client[os.getenv("MONGODB_DATABASE_NAME")]
entry_collection = mongo_db[os.getenv("MONGODB_COLLECTION_NAME")].with_options(
    write_concern=WriteConcern(
        w=0
    )  # this allows for uploading without waiting for DB to respond
)


def upload_data_entry_to_database(entry):
    result = entry_collection.insert_one(entry)


def test():
    entry = {
        "node_letter": "Q",
        "wind_direction_deg": 233,
        "wind_speed_m_s": 0.55,
        "corrected_wind_direction_deg": 31,
        "corrected_wind_speed_m_s": 0.55,
        "pressure_hPa": 980.2,
        "relative_humidity_percent": 32.7,
        "air_temperature_C": 16.8,
        "dewpoint_C": 0.3,
        "gps_location_raw": "+42.444400:-076.483512:+0262.79",
        "gps_latitude_deg": 42.4444,
        "gps_longitude_deg": -76.483512,
        "gps_height_m": 262.79,
        "station_timestamp_utc": "2026-03-08T21:03:41.1",
        "supply_voltage_V": 13.4,
        "status_code": "0004",
        "checksum_hex": "05",
        "program_timestamp_utc": datetime.datetime.now(datetime.timezone.utc),
    }
    print("Uploading...")
    upload_data_entry_to_database(entry)
    print("Uploaded!")


if __name__ == "__main__":
    test()
