import Image from "next/image";

export default function CourseCardItem({course}){
    return(
        <div>
            <div>
                <div className="flex justify-between items-center">
                    <Image src={'/other.png'} alt="other" width={50} height={50}/>
                </div>
                <h2 className="mt-3">{course?.topic}</h2>
                <p className="text-xs line-clamp-2">{course?.courseLayout?.summary}</p>
            </div>
        </div>
    )
}