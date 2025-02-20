import { Request, Response } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../services/productService';
import { NotFoundError } from '@shopmaster360/shared';


export const createProductController = async (req: Request, res: Response) => {
console.log("Step 1: Received request to create product");

    try {
        const file = req.file;
        console.log("Step 2: Extracted file from request");

        let {
        name,
        description,
        sku,
        brand,
        category,
        price,
        inventory,
        attributes,
        seller,
        status,
        } = req.body;
        console.log("Step 3: Extracted product details from request body");

        const media = file
        ? [{ type: "image", path: file.path }]
        : [];
        console.log("Step 4: Media array constructed", media);

        if (typeof price === "string") price = JSON.parse(price);
        if (typeof inventory === "string") inventory = JSON.parse(inventory);
        if (typeof attributes === "string") attributes = JSON.parse(attributes);
        if (typeof seller === "string") seller = JSON.parse(seller);

        console.log("Step 5: Parsed complex objects (if necessary)");

        const product = await createProduct({
        name,
        description,
        sku,
        brand,
        category,
        price,
        inventory,
        attributes,
        seller,
        status,
        media,
        });

        console.log("Step 6: Product created successfully", product);

        res.status(201).json(product);
    } catch (err) {
        console.error("Error in createProductController:", err);
        res.status(500).json({ error: "Could not create product" });
    }
};

export const getAllProductsController = async (req: Request, res: Response) => {

  try{
    const products = await getAllProducts();
    res.send(products);
  }catch(err){
    console.log(err);
    res.send({error: "could not get any products"});

  }
//   if (!products) {
//     throw new NotFoundError();
//   }
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(id);
  res.send(product);
};

export const updateProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedProduct = await updateProductById(id, req.body);
  res.send(updatedProduct);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteProductById(id);
  res.status(204).send();
};
