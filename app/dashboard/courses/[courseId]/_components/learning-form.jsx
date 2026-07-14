"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

import { updateCourse } from "@/app/actions/course";

export const LearningForm = ({ initialData, courseId }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const [learning, setLearning] = useState(initialData?.learning || []);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const addItem = () => {
    setLearning([...learning, ""]);
  };

  const removeItem = (index) => {
    setLearning(learning.filter((_, i) => i !== index));
  };

  const updateItem = (index, value) => {
    const temp = [...learning];
    temp[index] = value;
    setLearning(temp);
  };

  const onSubmit = async () => {
    try {
      const cleaned = learning.filter((item) => item.trim() !== "");

      await updateCourse(courseId, {
        learning: cleaned,
      });

      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border rounded-md bg-gray-50 p-4">
      <div className="flex justify-between items-center font-medium">
        What students will learn
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Learning
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-3">
          {learning.length === 0 ? (
            <p className="italic text-sm text-slate-500">
              No learning outcomes
            </p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {learning.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isEditing && (
        <div className="space-y-3 mt-4">
          {learning.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Learning outcome ${index + 1}`}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button variant="outline" type="button" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Learning Outcome
          </Button>

          <Button onClick={onSubmit}>Save</Button>
        </div>
      )}
    </div>
  );
};
