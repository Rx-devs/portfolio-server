const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn7ou.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
try{
	await client.connect();
	console.log('database connected');
	
	const database = client.db('portfolio_data');
	const projectsCollection = database.collection('projects');

	app.get('/projects', async (req,res) =>{
		const cursor = projectsCollection.find({});
		const projects = await cursor.toArray();
		res.send(projects);
	});
	
	app.get('/projects/:id', async(req,res)=>{
		const id = req.params.id;
		const query = { _id: ObjectId(id)};
		const project = await projectsCollection.findOne(query);
		res.json(project);
	})
}
finally {
// await client.close();
}	
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running this server');
});

app.listen(port, () => {
    console.log('Running server on port', port);
})