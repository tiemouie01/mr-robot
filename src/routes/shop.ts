import { Router } from "express";
import categoryController from "../controllers/categoryController";
import itemController from "../controllers/itemController";

const shopRouter = Router();

shopRouter.get("/", itemController.index);

// CATEGORY ROUTES
shopRouter.get("/categories", categoryController.category_list);
shopRouter.get("/category/create", categoryController.category_create_get);
shopRouter.post("/category/create", categoryController.category_create_post);
shopRouter.get("/category/:id/delete", categoryController.category_delete_get);
shopRouter.post(
  "/category/:id/delete",
  categoryController.category_delete_post
);
shopRouter.get("/category/:id", categoryController.category_detail);
shopRouter.get("/category/:id/update", categoryController.category_update_get);
shopRouter.post(
  "/category/:id/update",
  categoryController.category_update_post
);

// ITEM ROUTES
shopRouter.get("/items", itemController.item_list);
shopRouter.get("/item/create", itemController.item_create_get);
shopRouter.post("/item/create", itemController.item_create_post);
shopRouter.get("/item:/:id/delete", itemController.item_delete_get);
shopRouter.post("/item/:id/delete", itemController.item_delete_post);
shopRouter.get("/item/:id", itemController.item_detail);
shopRouter.get("/item/:id/update", itemController.item_update_get);
shopRouter.post("/item/:id/update", itemController.item_update_post);

export default shopRouter;
