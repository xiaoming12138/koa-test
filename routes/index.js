const router = require('koa-router')()
var fs=require("fs");
const send = require('koa-send');
var path=require("path");


router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/upload', async (ctx, next) => {
    console.log(ctx.request);
    const file=ctx.request.files.file;; // 上传的文件在ctx.request.files.file


    console.log(file);
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    // 修改文件的名称
    var myDate = new Date();
    var newFilename = myDate.getTime()+'.'+file.name.split('.')[1];
    var targetPath = path.join(__dirname, '../public/uploads/') + `/${newFilename}`;
    //创建可写流
    const upStream = fs.createWriteStream(targetPath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    //返回保存的路径
    return ctx.body = { code: 200, data: { url: 'http://' + ctx.headers.host + '/uploads/' + newFilename } };
});

router.get('/download', async (ctx)=>{
    console.log(ctx);
    const fileName = '1558425536616.txt'
    const name = ctx.params.name;
    const path = `public/uploads/${fileName}`;
    ctx.attachment(path);
    await send(ctx, path);
})



module.exports = router
