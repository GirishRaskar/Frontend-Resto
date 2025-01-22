//////////////////Database/////////////////////

// const {MongoClient} = require("mongodb");
const { MongoClient, ObjectId } = require('mongodb');
const URL = "mongodb://localhost:27017"
const client = new MongoClient(URL);

async function GetConnection()
{
	let result = await client.connect();
	let db = result.db("Resto")
	return db.collection("RestoDetails");
}

async function GetConnection1()
{
	let result = await client.connect();
	return result
}


/////////////////////////////////////////////


////////////////////Express setup/////////////////////

express = require("express")
eobj = express()
cors = require('cors')
eobj.use(cors({
	origin : 'http://localhost:4200',
	methods : ['GET', 'POST', 'PUT', 'DELETE'],
	headers : ['Content-Type', "Access-Control-Allow-Headers"]
}))
port = 5200
eobj.use(express.json());


function Marvellous()
{
	console.log("Server running on port 5200")
}

eobj.listen(port, Marvellous)
///////////////////////////////////////////////

//////////////////////controller//////////////////////

eobj.get('/getData', async (req, res) => {
	try {
	  const collection = await GetConnection();
	  const data = await collection.find().toArray(); // Fetch all documents from the collection
	  console.log('Data retrieved from database:', data);
	  res.json(data); // Send the data as JSON response
	} catch (err) {
	  console.error('Error retrieving data:', err);
	  res.status(500).send('Internal Server Error'); // Handle error if fetching fails
	}
  });
//

eobj.post('/postData', async (req, res) => {
	try {
	  const collection = await GetConnection();
	  const data = req.body; // Extract the data from the incoming request body
  
	  // Insert the data into MongoDB collection
	  const result = await collection.insertOne(data);
	  console.log('Data inserted into database:', result);
  
	  // Send a success response with inserted data
	  res.status(201).json({
		message: 'Data inserted successfully!',
		insertedId: result.insertedId, // Return the inserted ID
		insertedData: data, // Send back the inserted data
	  });
	} catch (err) {
	  console.error('Error inserting data:', err);
	  res.status(500).send('Internal Server Error'); // Handle error if insertion fails
	}
  });
  ////



  eobj.delete('/deleteData/:id', async (req, res) => {
    try {
        const collection = await GetConnection();
        const id = parseInt(req.params.id, 10); // Parse the ID as an integer (if it's numeric)

        // Validate the ID
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid custom ID format',
            });
        }

        // Delete the document by custom `id` field
        const result = await collection.deleteOne({ id: id });

        // Check if document was found and deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No record found with the given custom ID',
            });
        }

        // Respond with success
        console.log(`Record with custom ID ${id} deleted successfully.`);
        return res.status(200).json({
            success: true,
            message: 'Record deleted successfully',
        });

    } catch (err) {
        console.error('Error deleting record:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
});

//  

eobj.put('/updateData/:id', async (req, res) => {
    try {
        const collection = await GetConnection();
        const id = parseInt(req.params.id, 10); // Parse the ID as an integer

        // Validate ID
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid ID format',
            });
        }

        const updateData = req.body; // Data to update

        // Validate update data
        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update data provided',
            });
        }

        // Update the document
        const result = await collection.updateOne(
            { id: id }, // Match the document by custom `id` field
            { $set: updateData } // Update fields
        );

        // Check if the document was found and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No record found with the given ID',
            });
        }

        // Respond with success
        console.log(`Record with ID ${id} updated successfully.`);
        return res.status(200).json({
            success: true,
            message: 'Record updated successfully',
        });

    } catch (err) {
        console.error('Error updating record:', err);

        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined,
        });
    }
});
/////////////////////////////////////

eobj.post('/signup', async (req, res) => {
	try {
	  const con = await GetConnection1();
      const db = con.db("Resto")
      // Find user in the database
      const collection= await db.collection('UserDetails')

	  const data = req.body; // Extract the data from the incoming request body
  
	  // Insert the data into MongoDB collection
	  const result = await collection.insertOne(data);
	  console.log('Data inserted into database:', result);
  
	  // Send a success response with inserted data
	  res.status(201).json({
		message: 'Data inserted successfully!',
		insertedId: result.insertedId, // Return the inserted ID
		insertedData: data, // Send back the inserted data
	  });
	} catch (err) {
	  console.error('Error inserting data:', err);
	  res.status(500).send('Internal Server Error'); // Handle error if insertion fails
	}
  });

  //////////////////////////////
  // Simple login route
eobj.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Connect to the database
      const con = await GetConnection1();
      
      const db = con.db("Resto")
      // Find user in the database
      const user = await db.collection('UserDetails').findOne({ email, password });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // If credentials are correct
    //   res.status(200).json({ message: 'Login successful' });
    res.status(200).json({ message: 'Login successful' ,
        name: user.name});
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ message: 'Error logging in', error: error.message });
    } finally {
      // Close the database connection after the request is processed
      await client.close();
    }
  });