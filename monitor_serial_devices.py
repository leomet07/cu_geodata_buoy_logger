import serial.tools.list_ports
from gmx550_log_to_csv import parse_payload_line
from time import sleep
import datetime
import database_utils

ports = serial.tools.list_ports.comports()
for port in ports:
    print(f"port: {port.device}, description: {port.description}")


# TODO: make this connected to the port above
ser = serial.Serial(
    "/dev/ttyS0",
    19200,
    timeout=1,
    bytesize=serial.EIGHTBITS,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
)

while True:
    data = ser.readline()
    if data:
        line = data.decode(errors="ignore").strip()
        print(line)
        parsed_line = parse_payload_line(line)  # dict, each key is a column
        if parsed_line is None:
            print("Could not parse line.")
        parsed_line["program_timestamp_utc"] = datetime.datetime.now(
            datetime.timezone.utc
        )
        print(line, parsed_line)

        # upload to mongo
        database_utils.upload_data_entry_to_database(parsed_line)

        sleep(1)  # maximum logging frequencey is 60hz

    else:
        print("No data was read.")
