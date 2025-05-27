import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import clsx from "clsx";

function MaterialCardItem({ item }) {
  const isDisabled = item.disabled;

  return (
    <div
      className={clsx(
        "flex flex-col gap-5 items-center p-5 border shadow-md rounded-lg mt-5 transition",
        isDisabled ? "opacity-50 pointer-events-none bg-gray-100" : "bg-white"
      )}
    >
      <h2
        className={clsx(
          "p-1 px-2 text-white rounded-full text-[10px] mb-2",
          isDisabled ? "bg-gray-700" : "bg-blue-500"
        )}
      >
        {isDisabled ? "Unavailable" : "Ready"}
      </h2>

      <Image
        src={item.icon}
        alt={item.name}
        width={90}
        height={90}
        className={isDisabled ? "grayscale" : ""}
      />

      <h2 className="font-bold mt-3 text-center">{item.name}</h2>
      <p className="text-sm text-center">{item.desc}</p>

      <Button
        className={clsx(
          "mt-2 w-full text-white",
          isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        )}
        variant="outline"
        disabled={isDisabled}
      >
        {isDisabled ? "Disabled" : "View"}
      </Button>
    </div>
  );
}

export default MaterialCardItem;
