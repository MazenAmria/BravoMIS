-- BY: MAZEN AMRIA (PART 1)
CREATE TABLE IF NOT EXISTS employee (
	emp_id VARCHAR(50),		                                -- username
    emp_password VARCHAR(200) NOT NULL,	                    -- encrypted password
    emp_name VARCHAR(50),				                    -- real name
    emp_role VARCHAR(50) NOT NULL DEFAULT 'Unauthorized',   -- [Manager|Vending Manager|Cashier|Guest|Unauthorized]
    emp_status VARCHAR(50),                                 -- [مفصول|متقاعد|يعمل]
    emp_registration_date DATE,
    PRIMARY KEY (emp_id)
);

CREATE TABLE IF NOT EXISTS vendor (
	vendor_id VARCHAR(50),
    vendor_name VARCHAR(50),			                    -- vendor's name
    vendor_location VARCHAR(50),    	                    -- vendor's country
    PRIMARY KEY (vendor_id)
);

-- BY: AHMAD KHATIB
CREATE TABLE IF NOT EXISTS customer (
	customer_id VARCHAR(50),
    customer_name VARCHAR(50),
    date_of_birth DATE,
    points INTEGER,
    PRIMARY KEY (customer_id)
);

CREATE TABLE IF NOT EXISTS class_points (
    class VARCHAR(50),
    min_points INTEGER,
    max_points INTEGER,
    PRIMARY KEY (class)
);

CREATE TABLE IF NOT EXISTS invoice (
	invoice_id INTEGER AUTO_INCREMENT,
    total_price VARCHAR(50),
    invoice_time DATETIME,
    customer_id VARCHAR(50),
    cashier_id VARCHAR(50),
    PRIMARY KEY (invoice_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (cashier_id) REFERENCES employee(emp_id)
);

-- BY: SARA SHAABNA
CREATE TABLE IF NOT EXISTS category (
    category_id VARCHAR(50),
    category_name VARCHAR(50),
    PRIMARY KEY (category_id)
);

CREATE TABLE IF NOT EXISTS item (
    item_id VARCHAR(200),
    item_name VARCHAR(50),
    selling_price DOUBLE,
    remaining_quantity INTEGER,
    category_id VARCHAR(50),
    PRIMARY KEY (item_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE TABLE IF NOT EXISTS invoice_includes_item (
    quantity INTEGER NOT NULL,
    price_per_unit DOUBLE NOT NULL,
    item_id VARCHAR(200),
    invoice_id INTEGER NOT NULL,
    PRIMARY KEY (item_id, invoice_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id)
);

-- BY: MAZEN AMRIA (PART 2)
CREATE TABLE IF NOT EXISTS vending_process (
    process_id INTEGER AUTO_INCREMENT,
    vending_date DATE NOT NULL,			                    -- the date on which the item vended
    vended_item VARCHAR(200) NOT NULL,	                    -- the id (barcode) of the vended item
    vended_quantity INTEGER,
    vendor_id VARCHAR(50) NOT NULL,
    vending_manager_id VARCHAR(50) NOT NULL,	            -- the id of the employee who managed this process
    vending_price DOUBLE,
    production_date DATE,
    expiry_date DATE,
    FOREIGN KEY (vended_item) REFERENCES item(item_id),
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id),
    FOREIGN KEY (vending_manager_id) REFERENCES employee(emp_id),
    PRIMARY KEY (process_id)
);

CREATE TABLE IF NOT EXISTS tender (
    tender_id INTEGER NOT NULL,
    vending_manager_id VARCHAR(50),
    creation_time DATETIME,
    deadline DATETIME,
    FOREIGN KEY (vending_manager_id) REFERENCES employee(emp_id),
    PRIMARY KEY (tender_id)
);

CREATE TABLE IF NOT EXISTS vending_request (
    request_id INTEGER AUTO_INCREMENT,
    requested_item VARCHAR(200) NOT NULL,                   -- the id (barcode) of the requested item
    quantity INTEGER,
    before_date DATE,                                       -- the requested items should be vended before date
    offers_deadline DATETIME,
    request_time DATETIME,
    manager_id VARCHAR(50) NOT NULL,                        -- the id of the manager who requested this item
    vending_manager_id VARCHAR(50),	                        -- the id of the employee who resolved this request
    status VARCHAR(50) DEFAULT 'requested',                 -- the status of the request [requested|assigned|resolved]
    tender_id INTEGER,
    FOREIGN KEY (tender_id) REFERENCES tender(tender_id),
    FOREIGN KEY (requested_item) REFERENCES item(item_id),
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id),
    FOREIGN KEY (vending_manager_id) REFERENCES employee(emp_id),
    PRIMARY KEY (request_id)
);

CREATE TABLE IF NOT EXISTS offer (
    offer_id INTEGER AUTO_INCREMENT,
    tender_id INTEGER NOT NULL,
    vendor_id VARCHAR(50) NOT NULL,
    vending_price DOUBLE NOT NULL,
    vending_date DATE,
    submission_time DATETIME,
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id),
    FOREIGN KEY (tender_id) REFERENCES tender(tender_id),
    PRIMARY KEY (offer_id)
);
