const mongoose = require("mongoose");
const { wrap: async } = require("co");
const Paste = mongoose.model("Paste");

/**
 * List
 */

exports.index = async(function*(req, res) {
  const page = (req.query.page > 0 ? req.query.page : 1) - 1;
  const _id = req.query.item;
  const limit = 15;
  const options = {
    limit: limit,
    page: page,
  };

  if (_id) options.criteria = { _id };

  const pastes = yield Paste.list(options);
  const count = yield Paste.countDocuments();

  res.render("pastes/index", {
    title: "Pastes",
    pastes: pastes,
    page: page + 1,
    pages: Math.ceil(count / limit),
  });
});

/**
 * New paste
 */

exports.new = function(req, res) {
  res.render("pastes/new", {
    title: "New paste",
    paste: new Paste(),
  });
};

/**
 * Create an paste
 */

exports.create = async(function*(req, res) {
  const paste = new paste(only(req.body, "title body tags"));
  paste.user = req.user;
  try {
    yield paste.uploadAndSave(req.file);
    req.flash("success", "Successfully created paste!");
    res.redirect(`/pastes/${paste._id}`);
  } catch (err) {
    res.status(422).render("pastes/new", {
      title: paste.title || "New paste",
      errors: [err.toString()],
      paste,
    });
  }
});
