import clientPromise from './mongodb'

export interface BuoyLog {
  _id: string
  node_letter: string
  wind_speed_m_s: number
  air_temperature_C: number
  relative_humidity_percent: number
  pressure_hPa: number
  program_timestamp_utc: string
  wind_direction_deg: number
  corrected_wind_speed_m_s: number
  corrected_wind_direction_deg: number
  dewpoint_C: number
  gps_latitude_deg: number
  gps_longitude_deg: number
}

export async function getRecentBuoyLogs(limit = 50): Promise<BuoyLog[]> {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DATABASE_NAME)
  const collection = db.collection(process.env.MONGODB_COLLECTION_NAME!)

  const docs = await collection
    .find({})
    .sort({ program_timestamp_utc: -1 })
    .limit(limit)
    .toArray()

  return docs.reverse().map((doc) => ({
    _id: doc._id.toString(),
    node_letter: doc.node_letter,
    wind_speed_m_s: doc.wind_speed_m_s,
    air_temperature_C: doc.air_temperature_C,
    relative_humidity_percent: doc.relative_humidity_percent,
    pressure_hPa: doc.pressure_hPa,
    program_timestamp_utc:
      doc.program_timestamp_utc instanceof Date
        ? doc.program_timestamp_utc.toISOString()
        : String(doc.program_timestamp_utc),
    wind_direction_deg: doc.wind_direction_deg,
    corrected_wind_speed_m_s: doc.corrected_wind_speed_m_s,
    corrected_wind_direction_deg: doc.corrected_wind_direction_deg,
    dewpoint_C: doc.dewpoint_C,
    gps_latitude_deg: doc.gps_latitude_deg,
    gps_longitude_deg: doc.gps_longitude_deg,
  }))
}
