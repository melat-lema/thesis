"use client"

import { cn } from "@/lib/utils"

export const CategoryItem=({label, icon: Icon,isSelected,
    onClick})=>{
    return(
        <button
        onClick={onClick}
        className={cn(
            "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
            isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"

        )}
        type="button">
            {
                Icon &&<Icon size={20}/>
                
            }
            <div className="truncate">
                    {label}
                </div>
        </button>
    )
}