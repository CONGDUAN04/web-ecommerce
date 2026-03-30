import {
  getProductsService,
  getProductBySlugService,
  searchProductsService,
  getRelatedProductsService,
  getProductGroupsService,
  getProductGroupBySlugService,
} from "../../services/client/product.services.js";

const handleError = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({ ErrorCode: 1, message: error.message });
};

// GET /api/v1/products
export const getProducts = async (req, res) => {
  try {
    const result = await getProductsService(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách sản phẩm thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// GET /api/v1/products/search?q=
export const searchProducts = async (req, res) => {
  try {
    const result = await searchProductsService(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Tìm kiếm sản phẩm thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// GET /api/v1/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await getProductBySlugService(req.validated.params.slug);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy chi tiết sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};

// GET /api/v1/products/:slug/related
export const getRelatedProducts = async (req, res) => {
  try {
    const products = await getRelatedProductsService(req.validated.params.slug);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy sản phẩm liên quan thành công",
      data: products,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// GET /api/v1/product-groups
export const getProductGroups = async (req, res) => {
  try {
    const result = await getProductGroupsService(req.validated.query);
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy danh sách dòng sản phẩm thành công",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error, 500);
  }
};

// GET /api/v1/product-groups/:slug
export const getProductGroupBySlug = async (req, res) => {
  try {
    const group = await getProductGroupBySlugService(
      req.validated.params.slug,
      req.validated.query,
    );
    return res.status(200).json({
      ErrorCode: 0,
      message: "Lấy chi tiết dòng sản phẩm thành công",
      data: group,
    });
  } catch (error) {
    return handleError(res, error, 404);
  }
};
