import userService from '../services/UserService.js';
import NotFoundError from '../errors/not-found.js';

export const proceedIfThereIsEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    req.user = await userService.getBy({ email });

    next();
  } catch (e) {
    if (e instanceof NotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    
    res.status(500).json({ error: e.message });
  }
}

export const proceedIfThereIsNoEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    await userService.getBy({ email });

    res.status(422).json({ error: 'This email is already in use' });
  } catch (e) {
    next();
  }
}

export const auth = async (req, res, next) => {
  try {
    let token = req.cookies['x-access-token'];

    console.log(token);

    if (!token) {
      const { authorization } = req.headers;
    
      if (!authorization) {
        
        return res.status(401).json({ error: "The token must be provided" })
      }

      token = authorization.split(' ')[1];

      console.log(token)
    }

    const { id } = await userService.getUserFromToken(token);

    console.log(id)
    
    req.user = await userService.getAuthCompleteUser(id);

    next();
  } catch(e) {
    if (e instanceof NotFoundError) {
      return res.status(404).json({ error: e.message });
    }
    res.status(401).json({ error: 'Invalid Token' });
  }
};


// export const auth2 = async(req, res, next)=> {

// }