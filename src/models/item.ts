import { Schema, model } from "mongoose";

const ItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    stock: Number,
    image_url: String,
  },
  {
    virtuals: {
      url: {
        get() {
          return `/shop/item/${this._id}`;
        },
      },
    },
  }
);

const Item = model("Item", ItemSchema);

export default Item;
