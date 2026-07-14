"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ActiveFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = searchParams.getAll("category");
  const prices = searchParams.getAll("price");

  const removeFilter = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());

    const values = params.getAll(type).filter((v) => v !== value);

    params.delete(type);

    values.forEach((v) => params.append(type, v));

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (categories.length === 0 && prices.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant="ghost"
          className="text-xs h-7 bg-muted rounded-full gap-1 text-sky-700"
          onClick={() => removeFilter("category", category)}
        >
          {" "}
          {category} <X className="w-3" />{" "}
        </Button>
      ))}

      {prices.map((price) => (
        <Button
          key={price}
          variant="ghost"
          className="rounded-full"
          onClick={() => removeFilter("price", price)}
        >
          {price}
          <X className="w-3 h-3 ml-1" />
        </Button>
      ))}
    </div>
  );
};

export default ActiveFilters;
