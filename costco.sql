-- ============================================
-- Phase 02 Costco Dabase 
-- Complete Setup Script
-- ============================================



CREATE TABLE Users (
    UserID INTEGER NOT NULL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    LoginHistory TEXT
);

CREATE TABLE Item (
    Name VARCHAR(255) NOT NULL PRIMARY KEY,
    Favorite BOOLEAN DEFAULT FALSE,
    Calories INTEGER NOT NULL,
    Protein INTEGER NOT NULL,
    Carbs INTEGER NOT NULL,
    Fats INTEGER NOT NULL,
    Fiber INTEGER NOT NULL,
    Price INTEGER NOT NULL
);

CREATE TABLE Orders (
    OrderID INTEGER NOT NULL PRIMARY KEY,
    Date DATE NOT NULL,
    Favorite BOOLEAN DEFAULT FALSE,
    Notes TEXT,
    TotalCalories INTEGER NOT NULL,
    TotalProtein INTEGER NOT NULL,
    TotalCarbs INTEGER NOT NULL,
    TotalFats INTEGER NOT NULL,
    TotalFiber INTEGER NOT NULL,
    Receipt INTEGER NOT NULL,
    UserID INTEGER NOT NULL
);

CREATE TABLE OrderItem (
    OrderID INTEGER NOT NULL,
    ItemName VARCHAR(255) NOT NULL,
    Quantity INTEGER NOT NULL,
    PRIMARY KEY (OrderID, ItemName)
);

-- ============================================
--  - USERS
-- ============================================

INSERT INTO Users VALUES (1, 'John', 'Smith', 'john.smith@email.com', 'hashed_password_1', '2025-11-01 10:00:00');
INSERT INTO Users VALUES (2, 'Sarah', 'Johnson', 'sarah.j@email.com', 'hashed_password_2', '2025-11-02 14:30:00');
INSERT INTO Users VALUES (3, 'Mike', 'Williams', 'mike.w@email.com', 'hashed_password_3', NULL);
INSERT INTO Users VALUES (4, 'Emily', 'Brown', 'emily.b@email.com', 'hashed_password_4', '2025-11-03 09:15:00');
INSERT INTO Users VALUES (5, 'David', 'Garcia', 'david.g@email.com', 'hashed_password_5', '2025-11-05 16:45:00');
INSERT INTO Users VALUES (6, 'Lisa', 'Martinez', 'lisa.m@email.com', 'hashed_password_6', '2025-11-04 11:20:00');
INSERT INTO Users VALUES (7, 'James', 'Rodriguez', 'james.r@email.com', 'hashed_password_7', NULL);
INSERT INTO Users VALUES (8, 'Jessica', 'Lopez', 'jessica.l@email.com', 'hashed_password_8', '2025-11-06 13:45:00');
INSERT INTO Users VALUES (9, 'Robert', 'Wilson', 'robert.w@email.com', 'hashed_password_9', '2025-11-07 15:30:00');
INSERT INTO Users VALUES (10, 'Amanda', 'Taylor', 'amanda.t@email.com', 'hashed_password_10', '2025-11-08 08:00:00');

-- ============================================
-- - ITEMS
-- ============================================

INSERT INTO Item VALUES ('Hot Dog with Bun', FALSE, 552, 24, 46, 32, 2, 2);
INSERT INTO Item VALUES ('Pizza Slice Pepperoni', FALSE, 710, 31, 70, 36, 3, 2);
INSERT INTO Item VALUES ('Pizza Slice Cheese', FALSE, 680, 28, 70, 32, 3, 2);
INSERT INTO Item VALUES ('Pizza Slice Combo', FALSE, 750, 34, 70, 38, 3, 2);
INSERT INTO Item VALUES ('Chicken Bake', FALSE, 770, 46, 70, 26, 3, 4);
INSERT INTO Item VALUES ('Caesar Salad', FALSE, 650, 23, 20, 52, 4, 4);
INSERT INTO Item VALUES ('Berry Smoothie', FALSE, 290, 2, 71, 1, 5, 3);
INSERT INTO Item VALUES ('Fruit Smoothie', FALSE, 240, 1, 59, 0, 4, 3);
INSERT INTO Item VALUES ('Chocolate Chip Cookie', FALSE, 210, 2, 26, 11, 1, 1);
INSERT INTO Item VALUES ('Churro', FALSE, 290, 3, 36, 15, 1, 1);
INSERT INTO Item VALUES ('Turkey Sandwich', FALSE, 820, 56, 62, 34, 5, 4);
INSERT INTO Item VALUES ('Ice Cream Sundae', FALSE, 480, 8, 77, 15, 1, 2);
INSERT INTO Item VALUES ('Chicken Caesar Salad', FALSE, 680, 32, 18, 50, 4, 4);
INSERT INTO Item VALUES ('Beef Brisket Sandwich', FALSE, 890, 52, 64, 44, 3, 5);
INSERT INTO Item VALUES ('Acai Bowl', FALSE, 330, 4, 61, 9, 8, 5);

-- ============================================
--  - ORDERS
-- ============================================

INSERT INTO Orders VALUES (1001, '2025-11-01', FALSE, 'Lunch break', 1262, 55, 116, 68, 5, 1001, 1);
INSERT INTO Orders VALUES (1002, '2025-11-01', TRUE, 'My favorite combo', 1480, 77, 166, 67, 8, 1002, 1);
INSERT INTO Orders VALUES (1003, '2025-11-02', FALSE, NULL, 770, 46, 70, 26, 3, 1003, 2);
INSERT INTO Orders VALUES (1004, '2025-11-02', FALSE, 'Quick dinner', 1390, 59, 132, 68, 6, 1004, 3);
INSERT INTO Orders VALUES (1005, '2025-11-03', FALSE, NULL, 650, 23, 20, 52, 4, 1005, 4);
INSERT INTO Orders VALUES (1006, '2025-11-03', TRUE, 'Post-workout meal', 1590, 102, 132, 67, 7, 1006, 5);
INSERT INTO Orders VALUES (1007, '2025-11-04', FALSE, 'Family meal', 1900, 87, 166, 79, 9, 1007, 1);
INSERT INTO Orders VALUES (1008, '2025-11-04', FALSE, 'Light snack', 500, 5, 62, 26, 2, 1008, 2);
INSERT INTO Orders VALUES (1009, '2025-11-05', FALSE, 'Healthy choice', 970, 27, 79, 62, 9, 1009, 6);
INSERT INTO Orders VALUES (1010, '2025-11-05', TRUE, 'Best meal ever', 1590, 88, 132, 70, 8, 1010, 7);
INSERT INTO Orders VALUES (1011, '2025-11-06', FALSE, NULL, 680, 28, 70, 32, 3, 1011, 8);
INSERT INTO Orders VALUES (1012, '2025-11-06', FALSE, 'Dinner time', 1500, 59, 132, 66, 6, 1012, 9);
INSERT INTO Orders VALUES (1013, '2025-11-07', TRUE, 'Love this combo', 1240, 54, 133, 59, 6, 1013, 10);
INSERT INTO Orders VALUES (1014, '2025-11-07', FALSE, 'Quick bite', 1000, 58, 98, 47, 4, 1014, 1);
INSERT INTO Orders VALUES (1015, '2025-11-08', FALSE, NULL, 890, 52, 64, 44, 3, 1015, 2);

-- Order Item 

INSERT INTO OrderItem VALUES (1001, 'Hot Dog with Bun', 1);
INSERT INTO OrderItem VALUES (1001, 'Pizza Slice Pepperoni', 1);
INSERT INTO OrderItem VALUES (1002, 'Pizza Slice Pepperoni', 1);
INSERT INTO OrderItem VALUES (1002, 'Chicken Bake', 1);
INSERT INTO OrderItem VALUES (1003, 'Chicken Bake', 1);
INSERT INTO OrderItem VALUES (1004, 'Hot Dog with Bun', 1);
INSERT INTO OrderItem VALUES (1004, 'Turkey Sandwich', 1);
INSERT INTO OrderItem VALUES (1005, 'Caesar Salad', 1);
INSERT INTO OrderItem VALUES (1006, 'Chicken Bake', 1);
INSERT INTO OrderItem VALUES (1006, 'Turkey Sandwich', 1);
INSERT INTO OrderItem VALUES (1007, 'Pizza Slice Pepperoni', 1);
INSERT INTO OrderItem VALUES (1007, 'Pizza Slice Cheese', 1);
INSERT INTO OrderItem VALUES (1007, 'Churro', 2);
INSERT INTO OrderItem VALUES (1008, 'Chocolate Chip Cookie', 1);
INSERT INTO OrderItem VALUES (1008, 'Churro', 1);
INSERT INTO OrderItem VALUES (1009, 'Caesar Salad', 1);
INSERT INTO OrderItem VALUES (1009, 'Acai Bowl', 1);
INSERT INTO OrderItem VALUES (1010, 'Turkey Sandwich', 1);
INSERT INTO OrderItem VALUES (1010, 'Chicken Bake', 1);
INSERT INTO OrderItem VALUES (1011, 'Pizza Slice Cheese', 1);
INSERT INTO OrderItem VALUES (1012, 'Hot Dog with Bun', 1);
INSERT INTO OrderItem VALUES (1012, 'Turkey Sandwich', 1);
INSERT INTO OrderItem VALUES (1013, 'Pizza Slice Combo', 1);
INSERT INTO OrderItem VALUES (1013, 'Berry Smoothie', 1);
INSERT INTO OrderItem VALUES (1013, 'Chocolate Chip Cookie', 1);
INSERT INTO OrderItem VALUES (1014, 'Turkey Sandwich', 1);
INSERT INTO OrderItem VALUES (1014, 'Churro', 2);
INSERT INTO OrderItem VALUES (1015, 'Beef Brisket Sandwich', 1);
