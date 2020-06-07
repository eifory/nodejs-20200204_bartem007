const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, displayName, password } = ctx.request.body;
  let user = await User.findOne({email});
  
  if (user) {
    ctx.status = 400;
    return ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
  }

  try {
    const verificationToken = uuid();
    user = new User({
      email,
      displayName,
      verificationToken,
    });
    await user.setPassword(password);
    await user.save();

    const mailOptions = {
      template: 'confirmation',
      locals: {
        token: verificationToken,
      },
      to: email,
      subject: 'Подтверждение почты',
    };
    await sendMail(mailOptions);
    ctx.body = {status: 'ok'};
  } catch (err) {
    ctx.throw(500, {
      errors: {
        error: 'Не возможно создать пользователя с этими данными',
        },
      });
    }
  };

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) {
    return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  }
  user.verificationToken = undefined;
  await user.save();
  const token = await ctx.login(user);
  ctx.body = {token};
};
