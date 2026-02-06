import { getProductsHandler } from "./products.controller";

export async function productRoutes(app: any) {
  app.get("/products", getProductsHandler);
}
