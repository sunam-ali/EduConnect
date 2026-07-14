"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const PRICE_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const CATEGORY_OPTIONS = [
  { id: 1, label: "Design", value: "design" },
  { id: 3, label: "Development", value: "development" },
  { id: 4, label: "Marketing", value: "marketing" },
  { id: 5, label: "IT & Software", value: "it-software" },
  { id: 6, label: "Personal Development", value: "personal-development" },
  { id: 7, label: "Business", value: "business" },
  { id: 8, label: "Photography", value: "photography" },
  { id: 9, label: "Music", value: "music" },
  { id: 9, label: "Programming", value: "programming" },
];

const FilterCourse = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = searchParams.getAll("category");
  const prices = searchParams.getAll("price");

  const applyArrayFilter = ({ type, value }) => {
    const params = new URLSearchParams(searchParams.toString());

    const values = params.getAll(type);

    if (values.includes(value)) {
      params.delete(type);

      values.filter((v) => v !== value).forEach((v) => params.append(type, v));
    } else {
      params.append(type, value);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="hidden lg:block">
      <Accordion defaultValue={["categories"]} type="multiple">
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>

          <AccordionContent>
            <ul className="space-y-4">
              {CATEGORY_OPTIONS.map((option, index) => (
                <li key={option.value} className="flex items-center">
                  <Checkbox
                    id={`category-${index}`}
                    checked={categories.includes(option.value)}
                    onCheckedChange={() =>
                      applyArrayFilter({
                        type: "category",
                        value: option.value,
                      })
                    }
                  />

                  <label
                    htmlFor={`category-${index}`}
                    className="ml-3 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>

          <AccordionContent>
            <ul className="space-y-4">
              {PRICE_OPTIONS.map((option, index) => (
                <li key={option.value} className="flex items-center">
                  <Checkbox
                    id={`price-${index}`}
                    checked={prices.includes(option.value)}
                    onCheckedChange={() =>
                      applyArrayFilter({
                        type: "price",
                        value: option.value,
                      })
                    }
                  />

                  <label
                    htmlFor={`price-${index}`}
                    className="ml-3 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterCourse;
