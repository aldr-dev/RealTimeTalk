import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import Message from './models/Message';

const run = async () => {
  await mongoose.connect(config.database);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('messages');
  } catch (e) {
    console.log('Skipping drop...');
  }

  const [user1, user2, user3] = await User.create({
    username: 'ivan001',
    password: '*H#*YGYU',
    displayName: 'Иван',
    token: crypto.randomUUID(),
  }, {
    username: 'alex',
    password: '*IBU#D@BH',
    displayName: 'Александр',
    token: crypto.randomUUID(),
  }, {
    username: 'vasya007',
    password: 'nif3i4bi@',
    displayName: 'Василий',
    token: crypto.randomUUID(),
  });

  await Message.create(
    {
      user: user1,
      message: 'Привет, как дела? Я только что закончил работу над своим проектом, и теперь свободен. Чем занимаетесь?',
    },
    {
      user: user2,
      message: 'Привет! Отлично, у меня тоже всё хорошо. Сейчас разбираюсь с новой библиотекой для анимаций в React. Ты что-то подобное пробовал?',
    },
    {
      user: user3,
      message: 'Привет всем! Я только что начал изучать TypeScript. Столкнулся с трудностями в типизации сложных объектов. Может, у кого-то есть советы?',
    },
    {
      user: user1,
      message: 'Да, анимации – это круто, особенно с библиотеками вроде Framer Motion или React Spring. Кстати, по TypeScript могу помочь, если что-то конкретное.',
    },
    {
      user: user2,
      message: 'О, Framer Motion – это именно то, с чем я экспериментирую! А по TypeScript – лучше сразу уточни, с чем проблема, чтобы было проще подсказать.',
    },
    {
      user: user3,
      message: 'Спасибо, ребята! Я попробую сформулировать проблему более точно, чтобы было проще объяснить, в чем загвоздка.',
    },
  );

  await db.close();
};

run().catch(console.error);