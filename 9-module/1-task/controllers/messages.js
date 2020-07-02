const Message = require('../models/Message');
const mapMessage = require('../mappers/message')

module.exports.messageList = async function messages(ctx, next) {

  const userId = ctx.user.id;

  
  const messages = await Message.find({chat: userId})
    .sort({date: 1})
    .limit(20);
  console.log(messages);
  ctx.body = {messages: messages.map(mapMessage)};
};
