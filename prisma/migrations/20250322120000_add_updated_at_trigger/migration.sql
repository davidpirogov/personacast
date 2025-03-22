-- Function to automatically set updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to podcasts table
DROP TRIGGER IF EXISTS set_updated_at ON podcasts;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON podcasts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to api_clients table
DROP TRIGGER IF EXISTS set_updated_at ON api_clients;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON api_clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 