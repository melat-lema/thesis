"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export const ChapterDescriptionForm = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit=()=> setIsEditing((current)=> !current)
  const router=useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues:{
      description: initialData?.description || ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values) => {
    try {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
        toast.success("chapter updated");
        toggleEdit();
        router.refresh();
    } catch (error) {
        toast.error("something went wrong")
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course description
        <Button 
          variant="ghost"
          onClick={toggleEdit}
        >
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className={cn(
          "text-sm mt-2",
          !initialData.description && "text-slate-500 italic"
        )}>
            {!initialData.description && "No description"}
            
        </div>
      )}
      {isEditing &&(
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4">
                <FormField
                control={form.control}
                name="description"
                render={({field})=>(
                    <FormItem>
                        <FormControl>
                            <Textarea
                           {...field}/>
                        </FormControl>
                    </FormItem>
                )}/>
                <div className="flex items-center gap-x-2">
                    <Button
                    disabled={!isValid || isSubmitting}
                    type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
      )}
    </div>
  );
};
