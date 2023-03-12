CREATE DATABASE CookBookDB;
GO
USE CookBookDB;
GO

CREATE TABLE CuisineCategorys (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(256) NOT NULL UNIQUE
);

CREATE TABLE DishTypes(
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(256) NOT NULL UNIQUE
)

CREATE TABLE UnitOfMeasures (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(36) NOT NULL UNIQUE
);

CREATE TABLE GroceryItems (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(64) NOT NULL UNIQUE, 
	UnitOfMeasureId INT FOREIGN KEY REFERENCES UnitOfMeasures(Id) ON DELETE SET NULL,
	Price MONEY 
);

CREATE TABLE DishRecipes (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(128) NOT NULL UNIQUE,
	CuisineCategoryId INT FOREIGN KEY REFERENCES CuisineCategorys(Id) ON DELETE CASCADE,
	DishTypeId INT FOREIGN KEY REFERENCES DishTypes(Id) ON DELETE CASCADE,
	Price MONEY
);

CREATE TABLE RecipeIngredients (
	Id INT PRIMARY KEY IDENTITY(1,1),
	DishRecipeId INT FOREIGN KEY REFERENCES DishRecipes(Id) ON DELETE CASCADE,
	GroceryItemId INT FOREIGN KEY REFERENCES GroceryItems(Id) ON DELETE CASCADE,
	Quantity INT
);

CREATE TABLE Orders(
	Id INT PRIMARY KEY IDENTITY(1,1),
	OrderDate DATETIME2 not null,
	OrderKey uniqueidentifier not null
)

CREATE TABLE OrderDetails (
    OrderId INT NOT NULL,
    DishRecipeId INT NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (OrderId, DishRecipeId),
    FOREIGN KEY (OrderId) REFERENCES Orders(Id)
);