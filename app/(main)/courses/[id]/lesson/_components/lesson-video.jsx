"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/youtube";

export const LessonVideo = ({ courseId, lesson, module }) => {
  const [hasWindow, setHasWindow] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasWindow(true);
    }
  }, []);

  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId: lesson.id,
          moduleSlug: module,
          state: "started",
          lastTime: 0,
        }),
      });

      if (response.status === 200) {
        const result = await response.text();
        console.log(result);
        setStarted(false);
      }
    }

    if (started) {
      updateLessonWatch();
    }
  }, [started, courseId, lesson.id, module]);

  useEffect(() => {
    async function updateLessonWatch() {
      const response = await fetch("/api/lesson-watch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId: lesson.id,
          moduleSlug: module,
          state: "completed",
          lastTime: duration,
        }),
      });

      if (response.status === 200) {
        const result = await response.text();
        console.log(result);

        setEnded(false);
        router.refresh();
      }
    }

    if (ended) {
      updateLessonWatch();
    }
  }, [ended, courseId, duration, lesson.id, module, router]);

  function handleOnStart() {
    console.log("handleOnStart");
    setStarted(true);
  }

  function handleOnEnded() {
    console.log("handleOnEnded");
    setEnded(true);
  }

  function handleOnDuration(duration) {
    console.log("handleOnDuration", duration);
    setDuration(duration);
  }

  function handleOnProgress(state) {
    // console.log("handleOnProgress", state);
  }

  return (
    <>
      {hasWindow && (
        <ReactPlayer
          url={lesson.video_url}
          width="100%"
          height="470px"
          controls
          onStart={handleOnStart}
          onDuration={handleOnDuration}
          onProgress={handleOnProgress}
          onEnded={handleOnEnded}
        />
      )}
    </>
  );
};
