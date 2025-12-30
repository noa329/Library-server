/**
 * middlware creator
 * @param {*} schema joi validation schema
 * @returns 
 */
export const joiValidator = (schema) => {
    
    return (req, res, next) => {
        const { value, error, warning } = schema.validate(req.body);
        
        if (error) {
            return next({ status: 400, message: error.message });
        }

        req.body = value; 
        return next();
    };

 
}