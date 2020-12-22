const slugify = require("slugify");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const ApiFeatures = require("../utils/ApiFeatures");

const { errorApp } = require("../utils/error");

module.exports.getAllProduct = async (req, res) => {
  try {
    // // query string
    // const queryObj = { ...req.query };
    // console.log(queryObj);
    // // 1] normal query: ?quantity=100
    // const excludeField = ["page", "limit", "sort", "fields"];

    // // remove special field
    // excludeField.forEach((el) => delete queryObj[el]);

    // // 2] advance query: ?quantity[lt]=100
    // let queryStr = JSON.stringify(queryObj);

    // // console.log("before", queryStr);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // // console.log("after", queryStr);

    // let query = Product.find(JSON.parse(queryStr))
    //   .select("name productPicture price quantity description category")
    //   .populate({ path: "category", select: "_id name" });

    // // 3] sorting: ?sort=sort1,sort2
    // if (req.query.sort) {
    //   let sortBy = req.query.sort.split(",").join(" ");
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort("_id");
    // }

    // // 4] fields limiting: ?fields=name => select, ?fields=-name => no select
    // if (req.query.fields) {
    //   let fields = req.query.fields.split(",").join(" ");
    //   query = query.select(fields);
    // }

    // // 5] pagination: .skip(x).limit(limit)

    // let page = 1 * req.query.page || 1;
    // let limit = 1 * req.query.limit || 100;

    // let skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   let total = await Product.countDocuments();
    //   // check page
    //   if (skip >= total) throw new Error("This page does not exist");
    // }

    // const queryProducts = await Product.find({})
    //   .select("name productPicture price quantity description category")
    //   .populate({ path: "category", select: "_id name" });
    // console.log(queryProducts);

    const productFeature = new ApiFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await productFeature.query;
    // console.log(products);

    res.status(200).json({
      status: "success",
      total: products.length,
      data: {
        products: products,
      },
    });
  } catch (error) {
    errorApp(res, 404, "Something went wrong", error);
  }
};

module.exports.getProductsBySlug = async (req, res) => {
  try {
    const { slug } = req.params; // slug is category slug name

    // get id from category slug
    const category = await Category.findOne({ slug }).select("_id");

    console.log(category);
    // check category
    if (!category)
      res.status(400).json({
        status: "error",
        message: "Can not find product from slug",
      });

    // find product
    const products = await Product.find({ category: category._id })
      .select("name productPicture price quantity description category")
      .populate({ path: "category", select: "_id name" });

    console.log(products);
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (error) {
    errorApp(res, 404, "Something went wrong", error);
  }
};

module.exports.addProduct = async (req, res) => {
  try {
    const { files, body } = req;

    let picture;

    if (files.length > 0) {
      picture = files.map((file) => {
        return { img: `${process.env.API}/public/${file.filename}` };
      });
    }

    const tempProduct = {
      name: body.name,
      slug: slugify(body.name),
      productPicture: picture,
      price: body.price,
      quantity: body.quantity,
      description: body.description,
      category: body.category,
      createBy: req.user._id,
    };

    const product = await Product.create(tempProduct);

    if (!product)
      return res.status(400).json({
        status: "error",
        message: "Do not add product to database",
      });

    res.status(200).json({
      status: "success",
      message: "add product success",
      data: {
        product,
      },
    });
  } catch (error) {
    errorApp(res, 404, "Something went wrong", error);
  }
};
