import serial.tools.list_ports
from gmx550_log_to_csv import parse_payload_line
from time import sleep
import datetime
import database_utils

ports = serial.tools.list_ports.comports()

if len(ports) > 1:
    raise Exception(
        "Multiple serial devices are connected. Please make sure there is only one device connected, or hard-code which serial port is needed."
    )

port = ports[0]
print(f"port: {port.device}, description: {port.description}")
CONNECTION_PORT = (
    port.device or "/dev/ttyS0"
)  # /dev/ttyS0 is raspi (linux) default serial port

ser = serial.Serial(
    CONNECTION_PORT,
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
        parsed_line = parse_payload_line(line)  # dict, each key is a column
        if parsed_line is None:
            print(line, "Could not parse above line.\n")
        parsed_line["program_timestamp_utc"] = datetime.datetime.now(
            datetime.timezone.utc
        )

        # upload to mongo
        database_utils.upload_data_entry_to_database(parsed_line)

        sleep(1)  # maximum logging frequencey is 60hz

    else:
        print("No data was read.")
