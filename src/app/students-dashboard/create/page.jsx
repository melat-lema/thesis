"use client"
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import SelectOption from "./_components/SelectOption";
import { useState } from "react";
import TopicInput from "./_components/TopicInput";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Loader } from "lucide-react";
export default function Create(){
    const [step, setStep]=useState(0);
    const [formData, setFormData]= useState([])
    const { user } = useUser();
    const [loading, setLoading]= useState(false)
    const handleUserInput=(fieldName, fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]: fieldName
        }))
        console.log(formData)
    }
    const GenerateCourseOutline=async()=>{
        const cId=uuidv4()
        setLoading(true);
        const result= await axios.post('/api/generate-course-outline',{
            cId: cId,
            ...formData,
            createdBy: user?.primaryEmailAddress?.emailAddress

        })
        setLoading(false)
        console.log(result.data.result.resp)
    }
      return(
        <div className="flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20">
            <h2 className="font-bold text-4xl text-blue-500">
                Start Building your personal Study Material
            </h2>
            <p className="text-gray-500">
                Fill All details in order to generate study material for your next project
            </p>
            <div className="mt-10">
                {step==0? <SelectOption seletedStudyType={(value)=>handleUserInput("studyType",value)}/>
                :<TopicInput SetTopic={(value)=>handleUserInput("topic", value)}
                setDifficultyLevel={(value)=>handleUserInput('difficultyLevel', value)}/>}
            </div>
            <div className="flex justify-between w-full mt-32">
                {step!=0?<Button variant="outline" onClick={()=>setStep(step-1)}>Previous</Button>: '-'} 
                {step==0?<Button onClick={()=>setStep(step+1)}>Next</Button>:<Button onClick={GenerateCourseOutline} disabled={loading}>
                {loading ?<Loader className='animate-spin'/>: "Generate"}</Button>}
            </div>
        </div>
      )
}