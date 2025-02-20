import mongoose from 'mongoose';

interface Price {
  regular: number;
  sale?: number;
  discountPercentage?: number;
}

interface Warehouse {
  location: string;
  quantity: number;
}

interface Inventory {
  stock: number;
  warehouses?: Warehouse[];
}

interface Media {
  type: 'image' | 'video';
  url: string;
}

interface Seller {
  name: string;
  address?: string;
  email?: string;
  contact?: string;
}

interface ProductAttrs {
  name: string;
  description?: string;
  sku: string;
  brand?: string;
  category?: mongoose.Schema.Types.ObjectId;
  price: Price;
  inventory: Inventory;
  attributes?: Record<string, any>;
  media?: Media[];
  seller: Seller;
  status?: 'active' | 'inactive';
}

interface ProductDoc extends mongoose.Document {
  name: string;
  description?: string;
  sku: string;
  brand?: string;
  category?: mongoose.Schema.Types.ObjectId;
  price: Price;
  inventory: Inventory;
  attributes?: Record<string, any>;
  media: Media[];
  seller: Seller;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, unique: true, required: true },
    brand: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      regular: { type: Number, required: true },
      sale: { type: Number },
      discountPercentage: { type: Number },
    },
    inventory: {
      stock: { type: Number, required: true },
      warehouses: [
        {
          location: String,
          quantity: Number,
        },
      ],
    },
    attributes: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    media: [
      {
        type: {
          type: String,
          enum: ['image', 'video'],
          required: true,
        },
        path: { type: String, required: true },
      },
    ],
    seller: {
      name: { type: String, required: true },
      address: String,
      email: String,
      contact: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
    collection: 'productinfo',
  }
);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };
