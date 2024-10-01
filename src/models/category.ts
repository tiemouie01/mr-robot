import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
  name: String,
  description: String,
});

CategorySchema.virtual("url").get(function () {
  return `/shop/category/${this._id}`;
});

const CategoryModel = model("Category", CategorySchema);

export default CategoryModel;
