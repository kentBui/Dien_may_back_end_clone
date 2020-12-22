const { default: slugify } = require("slugify");

const Category = require("../models/category.model");

const { errorApp } = require("../utils/error");

const createCateList = (categories, parentId = null) => {
  const list = [];
  let category;

  if (parentId == null) {
    category = categories.filter((cate) => cate.parentId == undefined);
  } else {
    category = categories.filter((cate) => cate.parentId == parentId);
  }

  for (let cate of category) {
    list.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      categoryImage: cate.categoryImage,
      children: createCateList(categories, cate._id),
    });
  }

  return list;
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories)
      return res.status(400).json({
        status: "error",
        message: "Do not get categories",
      });

    // console.log(categories);
    console.log(createCateList(categories));

    res.status(201).json({
      status: "success",
      data: {
        category: createCateList(categories),
      },
    });
  } catch (error) {
    errorApp(res, 400, "Do not get categories", error);
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const categoryObject = {
      name: req.body.name,
      slug: slugify(req.body.name),
    };

    if (req.body.parentId) {
      categoryObject.parentId = req.body.parentId;
    }

    if (req.file) {
      console.log(req.file);
      categoryObject.categoryImage =
        process.env.API + "/public/" + req.file.filename;
    }
    console.log(categoryObject);

    const currentCategory = await Category.create(categoryObject);
    console.log(currentCategory);

    res.status(200).json({
      status: "success",
      data: { category: currentCategory },
    });
  } catch (error) {
    errorApp(res, 400, "Your category do not add to categories list", error);
  }
};
