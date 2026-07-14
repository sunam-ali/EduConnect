/* eslint-disable react/no-unescaped-entities */
import ActiveFilters from "./_components/ActiveFilters";
import FilterCourse from "./_components/FilterCourse";
import FilterCourseMobile from "./_components/FilterCourseMobile";
import SearchCourse from "./_components/SearchCourse";
import SortCourse from "./_components/SortCourse";

import { getCourseList } from "@/queries/courses";
import CourseCard from "./_components/CourseCard";

const CoursesPage = async ({ searchParams }) => {
  const courses = await getCourseList({
    search: searchParams.search,
    sort: searchParams.sort,
    category: searchParams.category,
    price: searchParams.price,
  });

  return (
    <section
      id="courses"
      className="container space-y-6   dark:bg-transparent py-6"
    >
      {/* <h2 className="text-xl md:text-2xl font-medium">All Courses</h2> */}
      {/* header */}
      <div className="flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row">
        <SearchCourse />
        <div className="flex items-center justify-end gap-2 max-lg:w-full">
          <SortCourse />
          {/* Filter Menus For Mobile */}
          <FilterCourseMobile />
        </div>
      </div>
      {/* header ends */}
      {/* active filters */}
      <ActiveFilters />
      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          {/* these component can be re use for mobile also */}
          <FilterCourse />
          {/* Course grid */}
          <div className="lg:col-span-3">
            {courses.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 px-6 text-center">
                <h3 className="text-xl font-semibold">No courses found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  We couldn't find any courses matching your search or selected
                  filters. Try changing your search term or clearing some
                  filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};
export default CoursesPage;
