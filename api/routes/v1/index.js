const Express = require("express"),
  UserRoutes = require("./user.route"),
  AuthRoutes = require("./auth.route");

const router = Express.Router();

router.get("/status", (req, res) => res.send(200));

router.use("/auth", AuthRoutes);
router.use("/users", UserRoutes);

module.exports = router;
