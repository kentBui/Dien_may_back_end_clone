class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // query = Products.find({})
    this.queryString = queryString; // queryString = req.query
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeField = ["sort", "fields", "page", "limit"];

    excludeField.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    // console.log("before", queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log("after", queryStr);
    this.query = this.query
      .find(JSON.parse(queryStr))
      .select("name productPicture price quantity description category")
      .populate({ path: "category", select: "_id name" });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }

    return this;
  }

  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 100;

    let skip = (page - 1) * limit;

    if (this.queryString.page) {
      let total = this.query.length;
      if (skip > total) throw new Error("This page does not exist");
    }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
