import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: String,
    description: String,
    image_url: String,
  },
  {
    virtuals: {
      url: {
        get() {
          return `/shop/category/${this._id}`;
        },
      },
    },
  }
);

const Category = model("Category", CategorySchema);

export default Category;
