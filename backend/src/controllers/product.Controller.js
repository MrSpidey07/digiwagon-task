import db from "../models/index.js";

const { Product, Variant, User, sequelize } = db;

/**
 * @desc    Create new product with variants
 * @route   POST /api/products
 * @access  Private (User)
 */
export const createProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { name, description, variants } = req.body;
    const userId = req.user.id;

    // Create product
    const product = await Product.create(
      { name, description, userId },
      { transaction }
    );

    // Create variants
    if (variants && variants.length > 0) {
      const variantData = variants.map((v) => ({
        ...v,
        productId: product.id,
      }));
      await Variant.bulkCreate(variantData, { transaction });
    }

    await transaction.commit();

    // Fetch product with variants
    const createdProduct = await Product.findByPk(product.id, {
      include: [{ model: Variant, as: "variants" }],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product: createdProduct },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * @desc    Get all products (Admin only)
 * @route   GET /api/products
 * @access  Private (Admin)
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Variant, as: "variants" },
        { model: User, as: "user", attributes: ["id", "email", "name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's products
 * @route   GET /api/products/my
 * @access  Private (User)
 */
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { userId: req.user.id },
      include: [{ model: Variant, as: "variants" }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Private
 */
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Variant, as: "variants" },
        { model: User, as: "user", attributes: ["id", "email", "name"] },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check authorization (user can only view their own products unless admin)
    if (req.user.role !== "admin" && product.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this product",
      });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
