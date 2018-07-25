const express = require('express');
const dbpost = require('./data/helpers/postDb');
const dbuser = require('./data/helpers/userDb');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
        res.send('Testing');

});


server.get('/api/posts', (req, res) => {
        const request = dbpost.get();

        request.then(response => {
        res.status(200).json(response);
        })

        .catch(err => {
        res.status(404).json({error: "The posts information could not be retrieved."});
        })

});


server.get('/api/users/:id', (req, res) => {
        const id = req.params.id;

       const request = dbuser.get(id);

        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The user with the specified ID does not exist." });
         else {
                 response.id = id;
                 res.status(200).json(response);
         }

        })

        .catch(err => {
        res.status(404).json({error: "The user with the specified ID does not exist."});
        })

});


server.get('/api/users', (req, res) => {
        const request = dbuser.get();

        request.then(response => {
        res.status(200).json(response);
        })

        .catch(err => {
        res.status(404).json({error: "The user information could not be retrieved."});
        })

});


server.get('/api/posts/:id', (req, res) => {
        const id = req.params.id;

       const request = dbpost.get(id);

        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The post with the specified ID does not exist." });
         else {
		 response.id = id;
		 res.status(200).json(response);
	 }

        })

        .catch(err => {
        res.status(404).json({error: "The user with the specified ID does not exist."});
        })

});


server.get('/:id', (req, res) => {
        const id = req.params.id;

       const request = dbpost.getPostTags(id);

        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The post with the specified ID does not exist or there are no tags on this post id." });
         else {
                // response.id = id;
                 res.status(200).json(response);
         }

        })

        .catch(err => {
        res.status(404).json({error: "The post with the specified ID does not exist."});
        })

});

server.get('/:id', (req, res) => {
        const id = req.params.id;

       const request = dbuser.getPostTags(id);

        request.then(response => {
        if(response.length==0) res.status(404).json({ error: "The user with the specified ID does not exist." });
         else {
                // response.id = id;
                 res.status(200).json(response);
         }

        })

        .catch(err => {
        res.status(404).json({error: "The user with the specified ID does not exist."});
        })

});




server.post('/api/posts', (req, res) => {

        const {text, userId} = req.body;
        const post = {text, userId};

        if (!text || !userId) {
                res.status(400).json({errorMessage: "Please provide text and userId for the post."});
        }

        else{

        const request = dbpost.insert(post);

        request.then(response => {
                response.text = post.text;
                response.userId = post.userId;
		response.message ="Successfully added a new post";

                res.status(201).json(response);
        })

        .catch(error => {
        res.status(500).json({ message: "There was an error while saving the user to the database" });
        })

        }  });

server.delete('/api/posts/:id', (req, res) => {
        const id = req.params.id;
        const request = dbpost.remove(id);

        request.then(response => {
                if(response===1) {
		let responseObject ={};
		responseObject.message = `Successfully deleted post with id ${id}`;


		res.json(responseObject);
		}	

                else res.status(404).json({ error: "The post with the specified ID does not exist." });
        })

        .catch(error => {
        res.status(500).json({ error: "The post could not be removed" });
        })

  });


server.delete('/api/users/:id', (req, res) => {
        const id = req.params.id;
        const request = dbuser.remove(id);

        request.then(response => {
                if(response===1) {
                let responseObject ={};
                responseObject.message = `Successfully deleted user with id ${id}`;


                res.json(responseObject);
                }

                else res.status(404).json({ error: "The user with the specified ID does not exist." });
        })

        .catch(error => {
        res.status(500).json({ error: "The user could not be removed" });
        })

  });



server.put('/api/posts/:id', (req, res) => {
  const { text} = req.body;

  const id =  req.params.id;
  const post = {text};


if (!text) {
                res.status(400).json({errorMessage: "Please provide text for the post."});
}

 const request = dbpost.update(id, post);


        request.then(response => {
                if(response===0)  res.status(404).json({ message: "The post with the specified ID does not exist." });
                else{ 
			let responseObject ={};
			responseObject.message= `Successfully updated post text with id ${id}`
			res.status(200).json(responseObject);
		}
	})

        .catch(error => {
        res.status(500).json({ message: "Couldn't update the post" });
        })
});

server.put('/api/users/:id', (req, res) => {
  const {name} = req.body;

  const id =  req.params.id;
  const post = {name};


if (!name) {
                res.status(400).json({errorMessage: "Please provide a name for the user."});
}

 const request = dbuser.update(id, post);


        request.then(response => {
                if(response===0)  res.status(404).json({ message: "The user with the specified ID does not exist." });
                else{
                        let responseObject ={};
                        responseObject.message= `Successfully updated user name with id ${id}`
                        res.status(200).json(responseObject);
                }
        })

        .catch(error => {
        res.status(500).json({ message: "Couldn't update the user" });
        })
});



server.use(function(req, res) {
  res.status(404).send("Wrong path, check url");
});



server.listen(7000, () => console.log('API running on port 7000'));


