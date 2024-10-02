import Category from "../models/category";
import Item from "../models/item";

import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { z, ZodError } from "zod";

// Define update item form schema
const itemFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must have at most 255 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must have at least 3 characters" })
    .max(255, { message: "Description must have at most 255 characters" }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be at least 0.01" }),
  stock: z.coerce.number().min(0, { message: "Stock must be at least 0" }),
});

const updateItemFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must have at most 255 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must have at least 3 characters" })
    .max(255, { message: "Description must have at most 255 characters" }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be at least 0.01" }),
  stock: z.coerce.number().min(0, { message: "Stock must be at least 0" }),
  id: z.string(),
});

const itemController = {
  index: expressAsyncHandler(async (req: Request, res: Response) => {
    // Get counts of all categories and items
    const [numCategories, numItems] = await Promise.all([
      Category.countDocuments({}).exec(),
      Item.countDocuments({}).exec(),
    ]);

    res.render("index", {
      title: "Home",
      category_count: numCategories,
      item_count: numItems,
    });
  }),

  // Display a list of all items
  item_list: expressAsyncHandler(async (req: Request, res: Response) => {
    const allItems = await Item.find().populate("category").exec();

    return res.render("item_list", {
      title: "Items",
      items: allItems,
    });
  }),

  // Display details for a specific item.
  item_detail: expressAsyncHandler(async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id).populate("category").exec();

    if (item) {
      return res.render("item_detail", {
        title: item.name,
        item,
      });
    } else {
      console.log("No item was found");
    }
  }),

  // Display item form on GET
  item_create_get: expressAsyncHandler(async (req: Request, res: Response) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();

    return res.render("item_form", {
      title: "Add Item",
      categories: allCategories,
      item: null,
      errors: null,
    });
  }),

  item_create_post: expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      itemFormSchema.parse(req.body);

      // Create new item
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      });

      // Check if an item with the same name exists
      const itemExists = await Item.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();

      if (itemExists) {
        // Item exists. Redirect to its detail page.
        res.redirect(itemExists.url);
      } else {
        await item.save();
        // New item saved. Redirect to its detail page.
        res.redirect(item.url);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const item = new Item({
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          stock: req.body.stock,
        });

        // Render the form again with sanitized values/error messages.
        const allCategories = await Category.find().sort({ name: 1 }).exec();

        res.render("item_form", {
          title: "Create Item",
          categories: allCategories,
          item: item,
          errors: error.errors,
        });
        return;
      }
    }
  }),

  // Display delete form on GET
  item_delete_get: expressAsyncHandler(async (req: Request, res: Response) => {
    const item = await Item.findById(req.params.id).exec();

    if (item === null) {
      // No results
      return res.redirect("/shop/items");
    }

    res.render("item_delete", {
      title: "Delete Item",
      item,
    });
  }),

  // Handle item delete on POST
  item_delete_post: expressAsyncHandler(async (req: Request, res: Response) => {
    // Get and delete item
    await Item.findByIdAndDelete(req.body.item_id).exec();
    res.redirect("/shop/items");
  }),

  // Display update form on GET
  item_update_get: expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get item
      const [item, allCategories] = await Promise.all([
        Item.findById(req.params.id).populate("category").exec(),
        Category.find().sort({ name: 1 }).exec(),
      ]);

      if (item === null) {
        const err = new Error("Item not found");
        return next(err);
      }

      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: allCategories,
        errors: null,
      });
    }
  ),

  // Handle item update on POST
  item_update_post: expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      updateItemFormSchema.parse(req.body);

      // Create a new item instance and set it's id field.
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
        _id: req.params.id,
      });

      // Update item using the id from the form
      const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        item,
        {}
      ).exec();
      if (updatedItem) {
        res.redirect(updatedItem.url);
      } else {
        console.log("Item does not exist");
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const [previousItem, allCategories] = await Promise.all([
          Item.findById(req.params.id).populate("category").exec(),
          Category.find().sort({ name: 1 }).exec(),
        ]);

        res.render("item_form", {
          title: "Update Item",
          item: previousItem,
          categories: allCategories,
          errors: error.errors,
        });
        return;
      }
    }
  }),
};

export default itemController;
