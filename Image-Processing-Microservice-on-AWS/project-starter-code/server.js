import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  app.use(function (req, res, next) {
    if (req.path != '/filteredimage') {
      res.send("try GET /filteredimage?image_url={{}}")
    }
    next()
  })
  
  // Main implement
  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;
    // 1. validate the image_url query
    if(!image_url) return res.status(404).send("Image is required!");

    // Validate URL
    const image_url_regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpeg|jpg|gif|png|svg)/
    if (!image_url.match(image_url_regex)) return res.status(400).send("Image URL format is incorrect!");

    // 2. call filterImageFromURL(image_url) to filter the image
    const filterImage = await filterImageFromURL(image_url.toString());

    // 3. send the resulting file in the response
    res.status(200).sendFile(filterImage, () => {
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([filterImage])
    })

  } );
  /**************************************************************************** */
  //! END

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();