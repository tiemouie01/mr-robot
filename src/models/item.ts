import { Schema, model } from "mongoose";

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  price: { type: Number, required: true },
  stock: Number,
});

ItemSchema.virtual("url").get(function () {
  return `/shop/item/${this._id}`;
});

const ItemModel = model("Item", ItemSchema);

export default ItemModel;
