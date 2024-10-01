// Model imports
import Category from "../models/category";
import Item from "../models/item";

import { Request, Response, NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { z, ZodError } from "zod";

// Define form schema for category
export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must have at least 3 characters" })
    .max(255, { message: "Name must have at most 255 characters" }),
  description: z
    .string()
    .trim()
    .min(3, { message: "Description must have at least 3 characters" })
    .max(255, { message: "Description must have at most 255 characters" }),
});

// DEFINE CATEGORY CONTROLLER

const categoryController = {
  // Display a list of all categories
  category_list: expressAsyncHandler(async (req: Request, res: Response) => {
    const allCategories = await Category.find().sort({ name: 1 }).exec();
    return res.render("category_list", {
      title: "Categories",
      categories: allCategories,
    });
  }),

  // Display detail page for a specific category
  category_detail: expressAsyncHandler(async (req: Request, res: Response) => {
    const [category, categoryItems] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "name description"),
    ]);
    return res.render("category_detail", {
      title: category?.name || "",
      category,
      categoryItems,
    });
  }),

  // Handle create category on GET
  category_create_get: expressAsyncHandler(
    async (req: Request, res: Response) => {
      return res.render("category_form", {
        title: "Create Category",
        category: null,
        errors: null,
      });
    }
  ),

  // Handle create category on POST
  category_create_post: expressAsyncHandler(
    async (req: Request, res: Response) => {
      try {
        categoryFormSchema.parse(req.body);

        // Create category
        const category = new Category({
          name: req.body.name,
          description: req.body.description,
        });

        // Check if a category with the same name exists.
        const categoryExists = await Category.findOne({ name: req.body.name })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (categoryExists) {
          // Category exists. Redirect to its detail page.
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          // New category saved. Redirect to category detail page.
          res.redirect(category.url);
        }
      } catch (error) {
        if (error instanceof ZodError) {
          // Create category
          const category = new Category({
            name: req.body.name,
            description: req.body.description,
          });

          // Render the form again with sanitized values/error messages.
          res.render("category_form", {
            title: "Create Category",
            category,
            errors: error.errors,
          });
          return;
        }
      }
    }
  ),

  // Display category delete form on GET
  category_delete_get: expressAsyncHandler(
    async (req: Request, res: Response) => {
      const [category, allItemsOfCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, "name description").exec(),
      ]);

      if (category === null) {
        // No results.
        res.redirect("shop/categories");
      }

      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        category_items: allItemsOfCategory,
      });
    }
  ),

  // Handle category delete on POST
  category_delete_post: expressAsyncHandler(
    async (req: Request, res: Response) => {
      await Category.findByIdAndDelete(req.body.categoryid).exec();
      res.redirect("/shop/categories");
    }
  ),

  // Display category update form on GET
  category_update_get: expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get category
      const category = await Category.findById(req.params.id).exec();

      if (category === null) {
        // No results
        const err = new Error("Category not found");
        return next(err);
      }

      res.render("category_form", {
        title: "Update genre",
        category: category,
        errors: null,
      });
    }
  ),

  // Handle category update on POST
  category_update_post: expressAsyncHandler(
    async (req: Request, res: Response) => {
      try {
        categoryFormSchema.parse(req.body);

        // Create new category with id retrieved from form.
        const category = new Category({
          name: req.body.name,
          description: req.body.description,
          _id: req.params.id,
        });

        // Update the category with the new values.
        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          category,
          {}
        );

        if (updatedCategory) res.redirect(updatedCategory.url);
        else console.log("No update record found");
      } catch (error) {
        // Get the values of the category before update and render them into the form with the errors
        if (error instanceof ZodError) {
          const previousCategory = Category.findById(req.params.id).exec();
          res.render("category_form", {
            title: "Update Category",
            category: previousCategory,
            errors: error.errors,
          });
          return;
        }
      }
    }
  ),
};

export default categoryController;
