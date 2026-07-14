"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

// Helper function to safely extract the YouTube Video ID and return an embed link
function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url; // Return original if it's already an embed link or alternate format
  } catch (e) {
    return "";
  }
}

export function IntroVideoModal({ introLesson, fallbackTitle }) {
  const embedUrl = getYouTubeEmbedUrl(introLesson?.video_url);

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "gap-2",
        )}
      >
        <PlayCircle className="w-5 h-5 text-sky-500" />
        Watch Free Preview
      </DialogTrigger>

      {/* Note the addition of: 
        [&>button]:text-neutral-400 (changes default cross icon color)
        hover:[&>button]:text-white   (changes color when user hovers over it)
      */}
      <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-neutral-800 rounded-lg shadow-2xl [&>button]:text-neutral-400 hover:[&>button]:text-white">
        <DialogHeader className="p-4 bg-neutral-900 text-white border-b border-neutral-800">
          <DialogTitle className="text-md font-medium truncate">
            Previewing:{" "}
            {introLesson?.title || fallbackTitle || "Course Introduction"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full aspect-video flex items-center justify-center bg-neutral-950">
          {!embedUrl ? (
            <p className="text-neutral-500 text-sm">
              No intro video available for this course yet.
            </p>
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={introLesson?.title || "Course Intro Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0 absolute inset-0"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
