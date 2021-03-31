function notFound(res, msg) {
  res.status(404).send(msg);
}

module.exports = { notFound };
