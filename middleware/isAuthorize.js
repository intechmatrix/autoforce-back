import { HttpStatus } from "../config/httpStatusCodes.js";
import { verifyToken } from "../utils/tokenController.js";


export const isAuthorize = async (req, res, next) => {
    try {
      let { authorization } = req.headers;
      console.log('Authorization : ', req.headers);

      if (authorization) {
        let response = await verifyToken(authorization);
        if (response.statusCode) {
           // Token verification failed
        res.status(response.statusCode).json({ message: response.error });
      } else {

                // Token verification succeeded

          res.locals.user_id = response.user_id;
          
          next();
        }
      } else {
        res.status(HttpStatus.UNAUTHORIZED_401).json({ message: "Not allowed" });
      }
    } catch (err) {
      console.log("err [middleware] : ", err);
      res.status(HttpStatus.BAD_REQUEST_400).json({ error: 'Auth Bad Request' });
    }
  };
  
