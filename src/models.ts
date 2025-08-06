import prisma from './prismaClient';
import bcrypt from 'bcrypt';
import { generateToken } from './utils/generateToken';

// User Registration
export const createUser = async (fullName: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Original:", password);
  console.log("Hashed:", hashedPassword);

  const user = await prisma.user.create({
    data: {
     fullName,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken({ id: user.id, role: 'user' });

  console.log('Generated JWT:', token);

  return { user, token };

};

// login User
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ id: user.id, role: 'user'});

  return { user, token };
};


// createTask
export const createTask = (
    userId: number,
    title:string,
    description?: string,
    dueDate?: Date
) => {
    return prisma.task.create({

        data: {
            title,
            description,
            dueDate,
            ownerId: userId,
        },
    })
}

//get all task
export const getAllTasks = (userId: number) => {
  return prisma.task.findMany({where: {ownerId: userId}});
};

//get task by id
export const getTaskById = (id: number, userId: number) => {
  return prisma.task.findFirst({
    where: {
      id, 
      ownerId: userId,
    },
  });
};

//updating a task
export const updateTask = (
  id: number,
  userId: number,
  data: Partial<{ title: string; description: string; status: string; dueDate: string | null }>
) => {
  const { dueDate, ...rest } = data;

  return prisma.task.updateMany({
    where: { id, ownerId: userId },
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : null, 
    },
  });
};


//deleting a task
export const deleteTask = (id: number, userId:number) => {
  return prisma.task.deleteMany({
    where: {id, ownerId: userId},
  });
};

//Columns

//create column
export const createColumn = async (title: string) => {
  return prisma.column.create({data:{title}});
}

//get all column
export const getAllColumns = async () => {
  return prisma.column.findMany({include:{ cards: true }});
}

//get column by id
export const getColumnById = async (id: number) => {
  return prisma.column.findUnique({ where: { id }, include: { cards: true } });
};

//delete column
export const deleteColumn = async (id: number) => {
  return prisma.column.delete({ where: { id } });
};


//card

//createCard
export const createCard = async (title: string, columnId: number) => {
  return prisma.card.create({ data: { title, columnId } });
};

//deleteCard
export const deleteCard = async (id: number) => {
  return prisma.card.delete({ where: { id } });
};

//updateCard
export const updateCard = async (id: number, title: string) => {
  return prisma.card.update({ where: { id }, data: { title } });
};