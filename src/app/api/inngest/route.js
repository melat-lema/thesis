import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, helloWorld } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    CreateNewUser // <-- This is where you'll always add all your functions
  ],
});
