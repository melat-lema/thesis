import { db } from "@/lib/db";
import { inngest } from "./client";
import { GenerateNotesModel } from "@/lib/AiModel";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const CreateNewUser = inngest.createFunction(
  { id: "create-user" },
  { event: "user.create" },
  async ({ event, step }) => {
    const { user } = event.data;

    await step.run("Check User and Create New if Not in DB", async () => {
      const existingUser = await db.user.findUnique({
        where: {
          email: user?.primaryEmailAddress?.emailAddress,
        },
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress,
          },
        });
        console.log("Created user:", newUser);
        return newUser;
      }

      console.log("User already exists:", existingUser);
      return existingUser;
    });

    return "Success";
  }
);

export const GenerateNotes = inngest.createFunction(
  { id: "generate-course" },
  { event: "notes.generate" },
  async ({ event, step }) => {
    const { course } = event.data;

    await step.run("Generate Chapter Notes", async () => {
      const chapters = course?.courseLayout?.chapters ?? [];

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        console.log("chapter : ", chapter);

        const PROMPT = `Generate beautiful exam material detailed content for the chapter, make sure to include all topic points in the content and make sure to give the output in beautiful HTML format that is visually appealing to see. (Do not Add HTML, Head, Body, title tag). Put the response HTML string in a dictionary with a field called "html_content". The chapter is: ${JSON.stringify(
          chapter
        )}`;

        const result = await GenerateNotesModel.sendMessage(PROMPT);
        const jsonAiResponse = JSON.parse(result.response.text());
        const html_content = jsonAiResponse.html_content;

        await db.chapterNote.create({
          data: {
            chapterId: i,
            courseId: String(course?.cId),
            notes: html_content,
          },
        });
      }

      return "Completed";
    });

    await step.run("Update Course Status to Ready", async () => {
      await db.studyMaterial.update({
        where: {
          id: course?.id,
        },
        data: {
          status: "Ready",
        },
      });

      return "Success";
    });
  }
);
