import { Product } from '../models/productModel';
import { NotFoundError } from '@shopmaster360/shared';

export const createProduct = async (productData: any) => {
  const product = Product.build ? Product.build(productData) : new Product(productData);
  await product.save();
  return product;
};

export const getAllProducts = async () => {
  const products = await Product.find({});
  return products;
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError();
  }
  return product;
};

export const updateProductById = async (id: string, updateData: any) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new NotFoundError();
  }

  Object.assign(product, updateData);
  await product.save();

  return product;
};

export const deleteProductById = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
      throw new NotFoundError();
    }
  
    await product.deleteOne();
    return product;
  };
  
