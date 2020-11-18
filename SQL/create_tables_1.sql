CREATE TABLE IF NOT EXISTS employees (
	emp_id VARCHAR(50) PRIMARY KEY,		    -- username
    emp_password VARCHAR(200) NOT NULL,	    -- encrypted password
    emp_name VARCHAR(50),				    -- real name
    emp_role VARCHAR(50) NOT NULL		    -- [Manager|Supplier|Cashier]
);
CREATE TABLE IF NOT EXISTS vendors (
	vendor_id VARCHAR(50) PRIMARY KEY,
    vendor_name VARCHAR(50),			    -- vendor's name
    vendor_location VARCHAR(50)			    -- vendor's country
);
CREATE TABLE IF NOT EXISTS vending_log (
    process_id INTEGER AUTO_INCREMENT,
	vending_date DATE NOT NULL,			    -- the date on which the item vended
	vended_item VARCHAR(200) NOT NULL,	    -- the id (barcode) of the vended item
    vended_quantity INTEGER,
    vending_price DOUBLE,
    vendor_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,	    -- the id of the employee who managed this process
    production_date DATE,
    expiry_date DATE,
    -- FOREIGN KEY (vended_item) REFERENCES items(item_id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (supplier_id) REFERENCES employees(emp_id),
    PRIMARY KEY (process_id)
);

CREATE TABLE IF NOT EXISTS vending_requests (
    request_id INTEGER AUTO_INCREMENT,
    requested_item VARCHAR(200) NOT NULL,	-- the id (barcode) of the requested item
    quantity INTEGER,
    before_date DATE,                       -- the requested items should be vended before date
    offers_deadline DATETIME,
    request_time DATETIME,
    manager_id VARCHAR(50) NOT NULL,        -- the id of the manager who requested this item
    supplier_id VARCHAR(50),	            -- the id of the employee who resolved this request
    status VARCHAR(50) DEFAULT 'requested', -- the status of the request [requested|resolved]
    -- FOREIGN KEY (requested_item) REFERENCES items(item_id),
    FOREIGN KEY (manager_id) REFERENCES employees(emp_id),
    FOREIGN KEY (supplier_id) REFERENCES employees(emp_id),
    PRIMARY KEY (request_id)
);

CREATE TABLE IF NOT EXISTS vending_offers (
    offer_id INTEGER AUTO_INCREMENT,
    request_id INTEGER NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    supplier_id VARCHAR(50) NOT NULL,
    vending_price DOUBLE NOT NULL,
    vending_date DATE,
    submission_time DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id),
    FOREIGN KEY (supplier_id) REFERENCES employees(emp_id),
    FOREIGN KEY (request_id) REFERENCES vending_requests(request_id),
    PRIMARY KEY (offer_id)
);
