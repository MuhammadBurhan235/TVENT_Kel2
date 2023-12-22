function authenticate(req, res, next) {
    // Check if the user is authenticated
    if (req.session && req.session.username) {
      // User is authenticated, proceed to the next middleware or route
      next();
    } else {
      // User is not authenticated, redirect to the login page
      res.redirect('/login');
    }
  }
  
  module.exports = {
    authenticate
  };