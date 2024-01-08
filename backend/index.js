const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PubNub = require('pubnub');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUBLISH_KEY,
  subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
  userId: "server"
});

mongoose.connect('mongodb+srv://amitxtest:amitxtest@cluster0.fwbyxnz.mongodb.net/chatwithpubnub?retryWrites=true&w=majority');
const User = mongoose.model('User', { username: String, password: String });

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.send({
            userId: user._id,
            name: user.username,
            message: 'Login successful'
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/users', async (req, res) => {
    try {
      const users = await User.find({}, { password: 0, __v: 0 });
      // console.log("users ", users);
      res.json(users);
    } catch (error) {
      console.error('Error fetching user list', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// app.post('/publish', (req, res) => {
//   const { sender, message, targetUserId } = req.body;
//   console.log("req.body", req.body);
//   const channelName = targetUserId;
//   const data = {
//     sender,
//     message,
//   };

//   const publishConfig = {
//     channel: channelName,
//     storeInHistory: true,
//     sendByPost: true,
//     message: data,
//     meta: {
//       userId: targetUserId,
//     },
//     // filterExpression: `sender != "${sender}"`,
//   }

//   pubnub.publish(publishConfig,
//     (status, response) => {
//       console.log("status", status);
//       if (status.error) {
//         res.status(500).json({ error: 'Failed to publish message' });
//       } else {
//         console.log("Message published successfully")
//       }
//     }
//   );
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
