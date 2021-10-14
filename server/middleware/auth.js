 const isUserAuthenticated = (req, res, next) => {
   console.log("req.user",req.user)
  if (req.user) {
    next();
  } else {
    console.log("401 e düştü ")
    res.status(401).send("You must login first!");
  }
};
module.exports= isUserAuthenticated
