/*!
 * Module dependencies
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Paste schema
 */

const PasteSchema = new Schema({
  content: { type: String, default: "" },
  poster: { type: String, default: "" },
  title: { type: String, default: "" },
  language: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: "" },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
PasteSchema.path("content").required(true, "Content cannot be blank");

/**
 * Methods
 */

PasteSchema.method({});

/**
 * Statics
 */

PasteSchema.statics = {
  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id })
      .populate("user", "name email username")
      .populate("comments.user")
      .exec();
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */

  list: function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate("user", "name username")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  },
};

/**
 * Register
 */

mongoose.model("Paste", PasteSchema);
