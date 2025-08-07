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

// Create a project
export const createProject = (
  userId: number,
  title: string,
  description?: string,
  dueDate?: Date
) => {
  return prisma.project.create({
    data: {
      title,
      description,
      dueDate,
      ownerId: userId,
    },
  });
};

// Get all projects for a user
export const getAllProjects = (userId: number) => {
  return prisma.project.findMany({
    where: { ownerId: userId },
  });
};

// Get project by ID
export const getProjectById = (id: number, userId: number) => {
  return prisma.project.findFirst({
    where: {
      id,
      ownerId: userId,
    },
  });
};

// Update a project
export const updateProject = (
  id: number,
  userId: number,
  data: Partial<{
    title: string;
    description: string;
    status: string;
    dueDate: string | null;
  }>
) => {
  const { dueDate, ...rest } = data;

  return prisma.project.updateMany({
    where: { id, ownerId: userId },
    data: {
      ...rest,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
};

// Delete a project
export const deleteProject = (id: number, userId: number) => {
  return prisma.project.deleteMany({
    where: { id, ownerId: userId },
  });
};




// create task - now accepts all relevant fields
export const createTask = async (
  title: string,
  description: string | null,
  status: string,
  dueDate: Date | null,
  projectId: number
) => {
  return prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate,
      projectId,
    },
  });
};

// get all tasks - optionally include related project if you want
export const getAllTasks = async () => {
  return prisma.task.findMany({
    include: { project: true }, // include related project
  });
};

// get task by id
export const getTaskById = async (id: number) => {
  return prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });
};

// update task - partial update with flexible fields
export const updateTask = async (
  id: number,
  data: Partial<{
    title: string;
    description: string | null;
    status: string;
    dueDate: Date | null;
    projectId: number;
  }>
) => {
  return prisma.task.update({
    where: { id },
    data,
  });
};

// delete task
export const deleteTask = async (id: number) => {
  return prisma.task.delete({
    where: { id },
  });
};
