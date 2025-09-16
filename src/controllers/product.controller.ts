import { Request, Response } from "express";
import Product, { IProduct } from "../models/product.model";

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    // We will add validation later to ensure all required fields are present
    const { name, description, price, category, stock, images } = req.body;

    const product: IProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({
      message: "Server Error: Could not create product",
      error: error.message,
    });
  }
};


// @desc    Create multiple products in bulk
// @route   POST /api/products/bulk
// @access  Private/Admin
export const createBulkProducts = async (req: Request, res: Response) => {
  try {
    // The request body is now an array of products, validated by Zod
    const productsToCreate = req.body;

    // Use insertMany for efficient bulk insertion
    const createdProducts = await Product.insertMany(productsToCreate);
    
    res.status(201).json({ 
      message: `${createdProducts.length} products created successfully.`,
      data: createdProducts 
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not create products in bulk', error: error.message });
  }
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      // Use 404 for not found
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, category, stock, images } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock ?? product.stock; // Use ?? to allow updating stock to 0
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // Mongoose v6+ uses deleteOne()
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
