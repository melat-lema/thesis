import { IconBadge } from "@/components/icon-badge"

export const InfoCard=({
    variant,
    icon:Icon,
    numberofItems,
    label,
})=>{
    return(
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge
            variant={variant}
            icon={Icon}/>
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-gray-500 text-sm">
                    {numberofItems} {numberofItems===1? "Course": "Courses"}
                </p>
            </div>
        </div>
    )
}