-- SQL queries
-- Additional SQL queries for analysis
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_timestamp ON vehicle_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_mode ON vehicle_records(mode);

-- Query for mode switching frequency
SELECT 
    mode,
    COUNT(*) as frequency,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vehicle_records), 2) as percentage
FROM vehicle_records
GROUP BY mode
ORDER BY frequency DESC;

-- Query for efficiency analysis
SELECT 
    mode,
    AVG(efficiency) as avg_efficiency,
    MIN(efficiency) as min_efficiency,
    MAX(efficiency) as max_efficiency,
    COUNT(*) as record_count
FROM vehicle_records
GROUP BY mode;

-- Query for battery usage patterns
SELECT 
    CASE 
        WHEN battery_level >= 80 THEN 'High (80-100%)'
        WHEN battery_level >= 50 THEN 'Medium (50-79%)'
        ELSE 'Low (0-49%)'
    END as battery_range,
    COUNT(*) as count,
    AVG(efficiency) as avg_efficiency
FROM vehicle_records
GROUP BY battery_range
ORDER BY battery_range;

-- Query for speed analysis
SELECT 
    CASE 
        WHEN speed < 30 THEN 'Low Speed (<30 km/h)'
        WHEN speed < 70 THEN 'Medium Speed (30-70 km/h)'
        ELSE 'High Speed (>70 km/h)'
    END as speed_range,
    COUNT(*) as count,
    AVG(efficiency) as avg_efficiency,
    AVG(battery_level) as avg_battery
FROM vehicle_records
GROUP BY speed_range
ORDER BY speed_range;