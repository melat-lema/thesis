"use client";

import * as z from "zod";
import axios from "axios"; 
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({
  initialData,
  courseId,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit=()=> setIsEditing((current)=> !current)
  const router=useRouter();
 
  

  const onSubmit = async (values) => {
    try {
        await axios.patch(`/api/courses/${courseId}`, values);
        toast.success("course updated");
        toggleEdit();
        router.refresh();
    } catch (error) {
        toast.error("something went wrong")
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button 
          variant="ghost"
          onClick={toggleEdit}
        >
          {isEditing &&  (
            <>Cancel</>
          )}
          {!isEditing && !initialData.imageUrl &&(
            <>
            <PlusCircle className="h-4 w-4 mr-2"/>
            Add an image
            </>
          )} 
          {!isEditing && initialData.imageUrl &&(
            <>
            <Pencil className="h-4 w-4 mr-2" />
            Edit image
          </>
          )}
            
          
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500"/>

          </div>
        ): (
          <div className="relative aspect-video mt-2">
            <img
            alt="Upload"
          
           
    className="object-cover rounded-md w-full"
           src={initialData.imageUrl}
            />

          </div>
        )
      )}
      {isEditing &&(
        <div className="max-w-xs">
          <FileUpload
          className="h-24 w-full"
          endpoint="courseImage"
          onChange={(url)=>{
            if(url){
              onSubmit({imageUrl: url});
            }
          }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
        
      )}
    </div>
  );
};
