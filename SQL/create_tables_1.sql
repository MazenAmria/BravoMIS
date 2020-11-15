CREATE TABLE IF NOT EXISTS employees (
	emp_id VARCHAR(50) PRIMARY KEY,		-- username
    emp_password VARCHAR(200) NOT NULL,	-- encrypted password
    emp_name VARCHAR(50),				-- real name
    emp_role VARCHAR(50) NOT NULL		-- [Manager|Supplier|Cashier]
);
CREATE TABLE IF NOT EXISTS vendors (
	vendor_id VARCHAR(50) PRIMARY KEY,
    vendor_name VARCHAR(50),			-- vendor's name
    vendor_location VARCHAR(50)			-- vendor's country
);
CREATE TABLE IF NOT EXISTS vending_log (
    process_id VARCHAR(200),            -- calculated from (vending_date, vended_item, vendor_id, supplier_id) by the server side
	vending_date DATE NOT NULL,			-- the date on which the item vended
	vended_item VARCHAR(200) NOT NULL,	-- the id (barcode) of the vended item
    vended_quantity INTEGER,
    vending_price DOUBLE,
    vendor_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,	-- the id of the employee who managed this process
    production_date DATE,
    expiry_date DATE,
    -- FOREIGN KEY (vended_item) REFERENCES items(item_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (supplier_id) REFERENCES employees(emp_id),
    PRIMARY KEY (process_id)
);
