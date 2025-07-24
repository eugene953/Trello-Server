import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from './utils/generateToken';

const prisma = new PrismaClient();


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
 return prisma.task.findFirst({where: {id, ownerId: userId}}); 
};

//updating a task
export const updateTask = (
  id: number,
  userId: number,
  data: Partial<{ title: string; description: string; status: string; dueDate: Date }>
) => {
  return prisma.task.updateMany({
where: {id, ownerId: userId},
data,
  });
}

//deleting a task
export const deleteTask = (id: number, userId:number) => {
  return prisma.task.deleteMany({
    where: {id, ownerId: userId},
  });
};

