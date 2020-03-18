import Router from 'koa-router';


import userController from './controllers/user-controller';

const router = new Router({prefix: '/users'})

router
  .get('/get-all-users', userController.getall)
  .get('/download-users-json', userController.downloadUsersJSON)
  .post('/upload-csv', userController.uploadCsv)

export default router.routes();