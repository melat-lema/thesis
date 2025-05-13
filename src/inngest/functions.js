import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
export const CreateNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user.create' },
  async ({ event, step }) => {
    // Extract userId from the event data (Clerk's userId or other unique identifier)
    const userId = event.data.userId;

    // Check if the user exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If user doesn't exist, create a new one
    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          name: event.data.name,  // Assuming the name is passed in event data
          email: event.data.email, // Assuming the email is passed in event data
          isMember: true, // You can set any other default fields here
        },
      });
      
      // Optionally, log the creation or return a message
      console.log(`Created new user: ${newUser.id}`);
      return { message: `User ${newUser.name} created successfully!` };
    }

    // If the user already exists, return a message or handle accordingly
    return { message: `User ${existingUser.name} already exists.` };
  })