const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8080;
const authRoutes = require("./routes/auth.js");

require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/auth", authRoutes);
// console.log("f",authRoutes)
console.log("hhiii");

app.get("/", (req, res) => {
  res.send("hello world");
});
app.post('/', (req, res) => {
  const { message, user: sender, type, members } = req.body;
  console.log("bodyss",req.body)

  if(type === 'message.new') {
      members
          .filter((member) => member.user_id !== sender.id)
          .forEach(({ user }) => {
              if(!user.online) {
                  twilioClient.messages.create({
                      body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                      messagingServiceSid: messagingServiceSid,
                      to: user.phoneNumber
                  })
                      .then(() => console.log('Message sent!'))
                      .catch((err) => console.log(err));
              }
          })

          return res.status(200).send('Message sent!');
  }

  return res.status(200).send('Not a new message request');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
