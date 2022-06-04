// import slackService from "../services/SlackService.js"
// import userService from "../services/UserService.js"
// import workspaceService from "../services/WorkSpaceService.js"

// import mongoose from 'mongoose'

// class SlackController {
//   async handleCallback(req, res) {
//     try {
//       const code = req.body.code;  
//       console.log("code:", code)      
//       if (code) {   
        

//         const {userProfile, userData} = await slackService.getAccessData(code);
//         const {id,name,profile, team_id,tz,is_admin} = userProfile
//         const{phone,first_name,last_name,image_512} = profile
//         const {app_id,authed_user,access_token,team} = userData
//         const userID = await userService.findOrCreate(`${name}@gmail.com`, first_name);
//         const userId = userID.doc._id
//         console.log("ID", userID)
//         // const { slack_user_id } = userData;
//         userProfile.id = userId;
//         const userDat = {
//           slack_user_id:id,
//           slack_app_id:app_id,
//           slack_token:authed_user.access_token,
//           slack_bot_token:access_token,
//           slack_team_id:team.id,
//           slack_team_name:team.name,
//           slack_first_name:first_name,
//           slack_lastname:last_name,
//           slack_timezone:tz,
//           slack_role:is_admin,
//           slack_phone:phone,
//           slack_photo:image_512,
//           user:mongoose.Types.ObjectId(userId),
//           workspace:mongoose.Types.ObjectId(userId),


//         }

//         console.log("userData", userDat)
//         // const workspace = await workspaceService.save(userId,id,app_id,authed_user.access_token,access_token,team.id, team.name,first_name,last_name,tz,is_admin,phone,image_512);
//         const workspace = await workspaceService.save(userDat);

//         const user  =  await userService.getCompleteUser(userId)
//         const data = userService.generateLoginData(user);

//         // const {access_token} = authed_user
//         // const{id} = team
//         console.log(workspace);
//         // res.send(userData)

//         // res.cookie('token', data.token, { httpOnly: true, path: '/' });
//         res.json(data)
//         // res.redirect(
//         //   302,
//         //   encodeURI(`http://localhost:3000/dashboard/?token=${data.token}`),
//         // );
//         // res.end(data)
    
//         } else { res.redirect("http://localhost:3000")
//        } 
//     } catch (e) {
//       console.log("error")
//       console.log({error: e.message});
//       res.json({ error: e.message });
      
//     }
//   }
// }

// export default new SlackController();


import slackService from "../services/SlackService.js"
import userService from "../services/UserService.js"
import workspaceService from "../services/WorkspaceService.js"
import accountService from "../services/AccountService.js"
import Account from "../models/Account.js"



class SlackController {
  async handleCallback(req, res) {
    try {
      const code = req.body.code;
    
      if (code) {
        // console.log(code)
        const { email, userData } = await slackService.getAccessData(code);
        const id = await userService.findOrCreate(email);
        const userId = id.doc._id;
        // console.log("The user Data", userData);
      
        const { slack_user_id } = userData;
        userData.user = userId;
        const workspace = await workspaceService.save(userData);
        const { account, plan } = await accountService.findOrCreate(userId);
        // console.log("Created account", account);
        // console.log("Created plan", plan);

        const user  =  await userService.getCompleteUser(userId, slack_user_id);
        // console.log(user)
        const data = userService.generateLoginData(user);        
        console.log(data);
        // req.session.user = data
        // req.session.save()

        // console.log(req.session.user)
        // res.cookie('token', data.token, { httpOnly: true, path: '/' });
        console.log("returning data")
        res.cookie('x-access-token', data.token, { httpOnly: true, path:'/'});
        // console.log(req.cookies['x-access-token'])        
        res.json(data)
        
        // res.redirect(
          // 302,
          // encodeURI(`http://localhost:3000/login?code=${code}`),
        // );
    
        } else { res.redirect("http://localhost:3000")
       } 
    } catch (e) {
      console.log("error")
      console.log({error: e.message});
      res.json({ error: e.message });
      
    }
    
  }

  async uninstallApp (req, res) {
    const {token} = req.params;
    try {
      if (token) {
      (await slackService.uninstallApp(token));
      // res.json({message: uninstall})
      }
   } catch (e) {
     console.log(e.message)
      res.json({error: e.message});
    }
  }  
}

export default new SlackController();