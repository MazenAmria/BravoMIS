-- BY: MAZEN AMRIA (PART 1)
CREATE TABLE IF NOT EXISTS employee (
	emp_id VARCHAR(50),		                                -- username
    emp_password VARCHAR(200) NOT NULL,	                    -- encrypted password
    emp_name VARCHAR(50),				                    -- real name
    emp_role VARCHAR(50) NOT NULL DEFAULT 'Unauthorized',   -- [Manager|Vending Manager|Cashier|Guest|Unauthorized]
    emp_registration_date DATE,
    emp_status VARCHAR(50),                                 -- [Employed|Retired|Fired]
    PRIMARY KEY (emp_id),
    CONSTRAINT CHECK (emp_role IN ('Manager', 'Vending Manager', 'Cashier', 'Guest', 'Unauthorized')),
    CONSTRAINT CHECK (emp_status IN ('Employed', 'Retired', 'Fired'))
);

CREATE TABLE IF NOT EXISTS vendor (
	vendor_id VARCHAR(50),
    vendor_name VARCHAR(50),			                    -- vendor's name
    vendor_location VARCHAR(50),    	                    -- vendor's country
    PRIMARY KEY (vendor_id)
);

-- BY: AHMAD KHATIB (PART 1)
CREATE TABLE IF NOT EXISTS customer (
	customer_id VARCHAR(50),
    customer_name VARCHAR(50),
    date_of_birth DATE,
    PRIMARY KEY (customer_id)
);

CREATE TABLE IF NOT EXISTS invoice_discount(
    discount_id INTEGER AUTO_INCREMENT,
    discount_percentage INTEGER NOT NULL,
    total_price DECIMAL(10,2),
    min_date DATE,
    max_date DATE,
    discount_status VARCHAR(50) DEFAULT 'فعال',
    PRIMARY KEY (discount_id)
);

CREATE TABLE IF NOT EXISTS invoice (
	invoice_id INTEGER AUTO_INCREMENT,
    total_price DECIMAL(10,2),
    invoice_time DATETIME,
    customer_id VARCHAR(50),
    cashier_id VARCHAR(50),
    discount_id INTEGER,
    PRIMARY KEY (invoice_id),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (cashier_id) REFERENCES employee(emp_id),
    FOREIGN KEY (discount_id) REFERENCES invoice_discount(discount_id)
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
    item_id VARCHAR(200) NOT NULL,
    invoice_id INTEGER NOT NULL,
    PRIMARY KEY (item_id, invoice_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    FOREIGN KEY (invoice_id) REFERENCES invoice(invoice_id)
);

-- BY: AHMAD KHATIB (PART 2)
CREATE TABLE IF NOT EXISTS item_discount(
    discount_id INTEGER AUTO_INCREMENT,
    discount_percentage INTEGER NOT NULL,
    item_id VARCHAR(200),
    minimum_quantity INTEGER,
    min_date DATE,
    max_date DATE,
    discount_status VARCHAR(50) DEFAULT 'فعال',
    PRIMARY KEY (discount_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

-- BY: MAZEN AMRIA (PART 2)
CREATE TABLE IF NOT EXISTS vending_process (
    process_id INTEGER AUTO_INCREMENT,
    vending_date DATE NOT NULL,			                    -- the date on which the item vended
    vendor_id VARCHAR(50) NOT NULL,
    vending_manager_id VARCHAR(50) NOT NULL,	            -- the id of the employee who managed this process
    FOREIGN KEY (vendor_id) REFERENCES vendor(vendor_id),
    FOREIGN KEY (vending_manager_id) REFERENCES employee(emp_id),
    PRIMARY KEY (process_id)
);

CREATE TABLE IF NOT EXISTS vending_process_items (
    process_id INTEGER NOT NULL,
    item_id VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    vending_price REAL NOT NULL,
    production_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (process_id) REFERENCES vending_process(process_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    PRIMARY KEY (process_id, item_id)
);

CREATE TABLE IF NOT EXISTS vending_request (
    request_id INTEGER AUTO_INCREMENT,
    before_date DATE,                                       -- the requested items should be vended before date
    offers_deadline DATETIME,
    request_time DATETIME,
    manager_id VARCHAR(50) NOT NULL,                        -- the id of the manager who requested this item
    status VARCHAR(50) DEFAULT 'requested',                 -- the status of the request [requested|assigned|resolved]
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id),
    PRIMARY KEY (request_id),
    CONSTRAINT CHECK (status IN ('requested', 'assigned', 'resolved'))
);

CREATE TABLE IF NOT EXISTS tender (
    tender_id INTEGER NOT NULL AUTO_INCREMENT,
    request_id INTEGER NOT NULL,
    vending_manager_id VARCHAR(50),
    creation_time DATETIME,
    deadline DATETIME,
    status VARCHAR(50),                                     -- the status of the tender [open|closed|resolved]
    FOREIGN KEY (vending_manager_id) REFERENCES employee(emp_id),
    FOREIGN KEY (request_id) REFERENCES vending_request(request_id);
    PRIMARY KEY (tender_id),
    CONSTRAINT CHECK (status IN ('open', 'closed', 'resolved'))
);

CREATE TABLE IF NOT EXISTS vending_request_items (
    request_id INTEGER NOT NULL,
    item_id VARCHAR(200) NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (request_id) REFERENCES vending_request(request_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    PRIMARY KEY (request_id, item_id)
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

CREATE TABLE IF NOT EXISTS offer_items (
    offer_id INTEGER NOT NULL,
    item_id VARCHAR(200) NOT NULL,
    vending_price REAL NOT NULL,
    production_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    FOREIGN KEY (offer_id) REFERENCES offer(offer_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    PRIMARY KEY (offer_id, item_id)
);
