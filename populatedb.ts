#!/usr/bin/env node
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./src/models/category";
import Item from "./src/models/item";
import type { ICategory, IItem } from "./src/lib/definitions";

dotenv.config();

const categories: ICategory[] = [];
const items: IItem[] = [];

mongoose.set("strictQuery", false);

const mongoDB: string = process.env.MONGODB_URI || "";

main().catch((err) => console.log(err));

async function main(): Promise<void> {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function categoryCreate(
  index: number,
  name: string,
  description: string
): Promise<void> {
  const category = new Category({ name, description });
  await category.save();

  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index: number,
  name: string,
  description: string,
  category: ICategory,
  price: number,
  stock: number
): Promise<void> {
  const item = new Item({
    name,
    description,
    category,
    price,
    stock,
  });
  await item.save();
  items[index] = item;
  console.log(`Added item: ${name}`);
}

async function createCategories(): Promise<void> {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Smartphones", "Latest and greatest smartphones"),
    categoryCreate(1, "Laptops", "High-performance laptops for work and play"),
    categoryCreate(2, "Accessories", "Essential accessories for your devices"),
    categoryCreate(3, "Gaming", "Top-notch gaming consoles and accessories"),
    categoryCreate(4, "Home Appliances", "Modern appliances for your home"),
  ]);
}

async function createItems(): Promise<void> {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "iPhone 13",
      "Latest Apple smartphone",
      categories[0],
      99900,
      50
    ),
    itemCreate(
      1,
      "Samsung Galaxy S21",
      "Flagship Samsung smartphone",
      categories[0],
      79900,
      75
    ),
    itemCreate(
      2,
      "MacBook Pro",
      "High-performance laptop from Apple",
      categories[1],
      129900,
      30
    ),
    itemCreate(
      3,
      "Dell XPS 13",
      "Compact and powerful laptop",
      categories[1],
      99900,
      40
    ),
    itemCreate(
      4,
      "Wireless Mouse",
      "Ergonomic wireless mouse",
      categories[2],
      2000,
      150
    ),
    itemCreate(
      5,
      "Mechanical Keyboard",
      "High-quality mechanical keyboard",
      categories[2],
      5000,
      100
    ),
    itemCreate(
      6,
      "PlayStation 5",
      "Next-gen gaming console from Sony",
      categories[3],
      49900,
      20
    ),
    itemCreate(
      7,
      "Xbox Series X",
      "Powerful gaming console from Microsoft",
      categories[3],
      49900,
      25
    ),
    itemCreate(8, "Smart TV", "4K Ultra HD Smart TV", categories[4], 59900, 40),
    itemCreate(
      9,
      "Refrigerator",
      "Energy-efficient refrigerator",
      categories[4],
      89900,
      15
    ),
  ]);
}
