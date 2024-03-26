const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const routes = require('./routes/routes');
const application_routes = require('./routes/application');

const cors = require('cors');

const cookieParser = require('cookie-parser');


const app = express();


app.use(cors({
    credentials: true,
    origin: ['http://localhost:4200']
}));

app.use(cookieParser());


app.use(express.json());
app.use('/api', routes);
app.use('/api/application', application_routes);

// Middleware
app.use(bodyParser.json());


// Mongo URI
const mongoURI = 'mongodb://localhost:27017/QuickHireDB';

// Create mongo connection
mongoose.connect("mongodb://localhost:27017/QuickHireDB", {
    useNewUrlParser: true}).then(()=> {
        console.log("database successfully connected!");
    });
const conn = mongoose.connection;

// Init gfs
let gfs, bucket;
conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // const filename = buf.toString('hex') + path.extname(file.originalname);
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const fetchFileData = async (fileId, conn, bucket, file) => {
  try {
    // const file = await bucket.find({ _id: fileId }).toArray();
    let fileData = Buffer("").toString('base64');
    for await (const chunk of bucket.openDownloadStream(fileId)) {
      fileData += Buffer(chunk).toString('base64');
    }
    return fileData;
  } catch (error) {
    console.error(error);
  }
}

const upload = multer({ storage }).array('files');
const { Router } = require('express');
const file_router = Router();

//Uploads file to DB
file_router.post('/uploads', function (req, res) {
  try {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        res.status(400).send(err);
      } else if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      else{
        res.json(req.files);
        return req.files;
      }
    })
  }
  catch (error){
    console.log(error);
    res.status(400).send(error);
  }
})

// @route GET /files
// @desc  Display all files in JSON
file_router.get('/files', async (req, res) => {
  let result = await gfs.files.find({}).toArray((err, files) => {
    if (err) return res.status(400).json({ err });
    return res.json(files);
  });
  return res.json(result)
});


file_router.get('/files/:id', async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  // let result = await gfs.files.find({_id: id}).toArray(async(err, file) => {
  //   if (err) return res.status(400).json({ err });
  //       return res.json(file);
  // });
  // if(result.length){
  //   result[0]["fileData"] = await fetchFileData(id, conn, bucket);
  // }
  // return res.json(result[0])
  const readstream = bucket.openDownloadStream( id );
    readstream.pipe(res);
});
  
//Delete file
file_router.delete('/files/:id', async (req, res) => {
  let id = new mongoose.Types.ObjectId(req.params.id);
  try {
    await bucket.delete(id);
    res.send('File removed successfully');
  } catch (error) {
    res.send('Error removing file:', error);
  }
});
app.use('/api', file_router);

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));