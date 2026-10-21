-- Add user_id to orders for linking to customer profiles (nullable for backward compatibility)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'orders' AND column_name = 'user_id') THEN
        ALTER TABLE orders ADD COLUMN user_id UUID REFERENCES profiles(id);
        CREATE INDEX idx_orders_user_id ON orders(user_id);
    END IF;
END $$;

-- Add is_archived flag for soft deletes on cakes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cakes' AND column_name = 'is_archived') THEN
        ALTER TABLE cakes ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT false;
        CREATE INDEX idx_cakes_is_archived ON cakes(is_archived);
    END IF;
END $$;

-- Add updated_at trigger helper (optional but good practice)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for tables that have updated_at
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_toppings_updated_at ON toppings;
CREATE TRIGGER update_toppings_updated_at BEFORE UPDATE ON toppings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
