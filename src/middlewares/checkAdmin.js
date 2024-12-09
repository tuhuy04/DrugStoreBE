const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        code: 403,
        status: 'fail',
        error: 'Permission denied'
      });
    }
    next();
  };
  
  export default checkAdmin;
  