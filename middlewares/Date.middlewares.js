/**
 * middleware that adds the current date to every request
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const addRequestDate = (req, res, next) => {
  req.currentDate = new Date();
  next();
};

 /**
     * middleware that prints the current date for GET requests only
     * @param {import("express").Request} req request data
     * @param {import("express").Response} res response data
     * @param {import("express").NextFunction} next function to move to the next middleware
     */
export const printDateGET=(req, res, next)=>{
   if(req.method=="GET")
    {
        console.log("Current Date:" ,req.currentDate);
        
    }
    
    next();
}