import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

function MaterialCardItem({ item }) {
  return (
    <div className="flex flex-col gap-5 items-center p-5 border shadow-md rounded-lg mt-5">
      <h2 className="p-1 px-2 bg-blue-500 text-white rounded-full items-center text-[10px] mb-2">
        Ready
      </h2>
      <Image src={item.icon} alt={item.name} width={150} height={150} />
      <h2 className="font-bold mt-3"> {item.name}</h2>
      <p className="text-sm">{item.desc}</p>
      <Button className="mt-2 w-full bg-blue-600 text-white cursor-pointer" variant="outline">
        View
      </Button>
    </div>
  );
}

export default MaterialCardItem;
