import mongoose from "mongoose";

export interface ICategory {
  name?: String | null | undefined;
  description?: String | null | undefined;
  url?: String | null | undefined;
}

export interface IItem {
  name?: String | null | undefined;
  description?: String | null | undefined;
  category?: mongoose.Types.ObjectId | null | undefined;
  price?: Number | null | undefined;
  stock?: Number | null | undefined;
  url?: String | null | undefined;
}
