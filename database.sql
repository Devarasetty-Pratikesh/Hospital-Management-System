-- Create database
CREATE DATABASE IF NOT EXISTS hms_db;
USE hms_db;

-- 1. Admin Table
CREATE TABLE IF NOT EXISTS Admin (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS Staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    designation VARCHAR(50) NOT NULL,
    mobile VARCHAR(15) NOT NULL
);

-- 3. Cashier Table
CREATE TABLE IF NOT EXISTS Cashier (
    cashier_id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES Staff(staff_id) ON DELETE CASCADE
);

-- 4. Doctor Table
CREATE TABLE IF NOT EXISTS Doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00,
    appointed_by_admin INT,
    registered_by_staff INT,
    FOREIGN KEY (appointed_by_admin) REFERENCES Admin(user_id) ON DELETE SET NULL,
    FOREIGN KEY (registered_by_staff) REFERENCES Staff(staff_id) ON DELETE SET NULL
);

-- 5. Patient Table
CREATE TABLE IF NOT EXISTS Patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    age INT,
    dob DATE NOT NULL,
    admission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mobile VARCHAR(15) NOT NULL,
    registered_by_staff INT,
    FOREIGN KEY (registered_by_staff) REFERENCES Staff(staff_id) ON DELETE SET NULL
);

-- 6. Room Table
CREATE TABLE IF NOT EXISTS Room (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_no VARCHAR(10) NOT NULL UNIQUE,
    room_cost DECIMAL(10, 2) NOT NULL CHECK (room_cost >= 0)
);

-- 7. In_Patient Table
CREATE TABLE IF NOT EXISTS In_Patient (
    admission_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    room_id INT,
    ip_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE SET NULL
);

-- 8. In_Patient_Bill Table
CREATE TABLE IF NOT EXISTS In_Patient_Bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    admission_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    status VARCHAR(20) DEFAULT 'Unpaid',
    FOREIGN KEY (admission_id) REFERENCES In_Patient(admission_id) ON DELETE CASCADE
);

-- 9. Out_Patient Table
CREATE TABLE IF NOT EXISTS Out_Patient (
    patient_id INT PRIMARY KEY,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

-- 10. Medicine Table
CREATE TABLE IF NOT EXISTS Medicine (
    medicine_id INT AUTO_INCREMENT PRIMARY KEY,
    medicine_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0)
);

-- 11. Out_Patient_Medical Table
CREATE TABLE IF NOT EXISTS Out_Patient_Medical (
    outpatient_med_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    medicine_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (patient_id) REFERENCES Out_Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES Medicine(medicine_id) ON DELETE CASCADE
);

-- 12. Out_Patient_Bill Table
CREATE TABLE IF NOT EXISTS Out_Patient_Bill (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Unpaid',
    bill_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
);

-- 13. Appointment Table
CREATE TABLE IF NOT EXISTS Appointment (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    is_billed BOOLEAN DEFAULT FALSE,
    ip_bill_id INT NULL,
    op_bill_id INT NULL,
    appointment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (ip_bill_id) REFERENCES In_Patient_Bill(bill_id) ON DELETE SET NULL,
    FOREIGN KEY (op_bill_id) REFERENCES Out_Patient_Bill(bill_id) ON DELETE SET NULL
);

-- Initial seed data
INSERT IGNORE INTO Admin (username, password) VALUES ('admin', '$2a$10$x.X/k8eS2oD/V9v2394xUON3n7P.0xH268M61LwVjX4p6fQ/e1aGW'); -- password: password123
INSERT IGNORE INTO Staff (staff_id, fname, lname, username, designation, mobile) VALUES (1, 'Ravi', 'Kumar', 'ravi', 'Nurse', '9001');
INSERT IGNORE INTO Room (room_no, room_cost) VALUES ('101', 500.00), ('102', 600.00), ('103', 750.00), ('104', 1000.00);
INSERT IGNORE INTO Medicine (medicine_name, price) VALUES ('Paracetamol', 10.00), ('Amoxicillin', 50.00), ('Ibuprofen', 20.00), ('Cetirizine', 15.00);
