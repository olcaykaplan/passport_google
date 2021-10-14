 const isUserAuthenticated = (req, res, next) => {
   console.log("isUserAuthenticated req.user",req.user)
   console.log("isUserAuthenticated res.getHeaders",res.getHeaders())
  if (req.user) {
    next();
  } else {
    console.log("401 e düştü ")
    res.status(401).send("You must login first!");
  }
};
module.exports= isUserAuthenticated
