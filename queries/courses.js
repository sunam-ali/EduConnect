import { Category } from "@/model/category-model";
import { Course } from "@/model/course-model";
import { Lesson } from "@/model/lesson.model";
import { Module } from "@/model/module.model";
import { Quizset } from "@/model/quizset-model";
import { Quiz } from "@/model/quizzes-model";
import { Testimonial } from "@/model/testimonial-model";
import { User } from "@/model/user-model";

import {
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/lib/convertData";

import { getEnrollmentsForCourse } from "./enrollments";
import { getTestimonialsForCourse } from "./testimonials";

export async function getCourseList({
  search = "",
  sort = "",
  category = [],
  price = [],
} = {}) {
  const query = {
    active: true,
  };

  // Search
  if (search.trim()) {
    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        subtitle: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // Category Filter
  const categories = Array.isArray(category)
    ? category
    : category
      ? [category]
      : [];
  if (categories.length > 0) {
    const categoryIds = await Category.find({
      slug: { $in: categories },
    }).distinct("_id");

    query.category = {
      $in: categoryIds,
    };
  }

  // Price Filter
  const prices = Array.isArray(price) ? price : price ? [price] : [];
  if (prices.length === 1) {
    if (prices[0] === "free") {
      query.price = 0;
    }
    if (prices[0] === "paid") {
      query.price = { $gt: 0 };
    }
  }

  // --- POPULARITY SORT USING AGGREGATE ---
  if (sort === "popularity") {
    const courses = await Course.aggregate([
      // 1. Filter courses matching the query
      { $match: query },

      // 2. Look up enrollments matching this course's ID
      {
        $lookup: {
          from: "enrollments", // Make sure this matches your MongoDB collection name (usually lowercase plural)
          localField: "_id",
          foreignField: "course",
          as: "enrollments",
        },
      },

      // 3. Add a temporary field for popularity count
      {
        $addFields: {
          enrollmentCount: { $size: "$enrollments" },
        },
      },

      // 4. Sort by enrollment count in descending order
      { $sort: { enrollmentCount: -1 } },

      // 5. Project (Select) only the fields you need
      {
        $project: {
          title: 1,
          subtitle: 1,
          thumbnail: 1,
          modules: 1,
          price: 1,
          category: 1,
          instructor: 1,
          testimonials: 1,
        },
      },
    ]);

    // Populate the aggregation results manually
    const populatedCourses = await Course.populate(courses, [
      { path: "category", model: Category },
      { path: "instructor", model: User },
      { path: "testimonials", model: Testimonial },
      { path: "modules", model: Module },
    ]);

    return replaceMongoIdInArray(populatedCourses);
  }

  // --- STANDARD SORT (Price & Default) ---
  let sortOption = {};
  switch (sort) {
    case "price-asc":
      sortOption = { price: 1 };
      break;
    case "price-desc":
      sortOption = { price: -1 };
      break;
    default:
      sortOption = {};
  }

  const courses = await Course.find(query)
    .sort(sortOption)
    .select([
      "title",
      "subtitle",
      "thumbnail",
      "modules",
      "price",
      "category",
      "instructor",
    ])
    .populate({ path: "category", model: Category })
    .populate({ path: "instructor", model: User })
    .populate({ path: "testimonials", model: Testimonial })
    .populate({ path: "modules", model: Module })
    .lean();

  return replaceMongoIdInArray(courses);
}
export async function getCourseDetails(id) {
  const course = await Course.findById(id)
    .populate({
      path: "category",
      model: Category,
    })
    .populate({
      path: "instructor",
      model: User,
    })
    .populate({
      path: "testimonials",
      model: Testimonial,
      populate: {
        path: "user",
        model: User,
      },
    })
    .populate({
      path: "modules",
      model: Module,
      populate: {
        path: "lessonIds",
        model: Lesson,
      },
    })
    .populate({
      path: "quizSet",
      model: Quizset,
      populate: {
        path: "quizIds",
        model: Quiz,
      },
    })
    .lean();

  return replaceMongoIdInObject(course);
}

export async function getCourseDetailsByInstructor(instructorId, expand) {
  const publishedCourses = await Course.find({
    instructor: instructorId,
    active: true,
  }).lean();

  const enrollments = await Promise.all(
    publishedCourses.map(async (course) => {
      const enrollment = await getEnrollmentsForCourse(course._id.toString());
      return enrollment;
    }),
  );

  const groupedByCourses = Object.groupBy(
    enrollments.flat(),
    ({ course }) => course,
  );

  const totalRevenue = publishedCourses.reduce((acc, course) => {
    const quantity = groupedByCourses[course._id]
      ? groupedByCourses[course._id].length
      : 0;
    return acc + quantity * course.price;
  }, 0);

  const totalEnrollments = enrollments.reduce(function (acc, obj) {
    return acc + obj.length;
  }, 0);

  const testimonials = await Promise.all(
    publishedCourses.map(async (course) => {
      const testimonial = await getTestimonialsForCourse(course._id.toString());
      return testimonial;
    }),
  );

  const totalTestimonials = testimonials.flat();
  const avgRating =
    totalTestimonials.reduce(function (acc, obj) {
      return acc + obj.rating;
    }, 0) / totalTestimonials.length;

  //console.log("testimonials", totalTestimonials, avgRating);
  if (expand) {
    const allCourses = await Course.find({ instructor: instructorId }).lean();
    return {
      courses: allCourses?.flat(),
      enrollments: enrollments?.flat(),
      reviews: totalTestimonials,
    };
  }
  return {
    courses: publishedCourses.length,
    enrollments: totalEnrollments,
    reviews: totalTestimonials.length,
    ratings: avgRating.toPrecision(2),
    revenue: totalRevenue,
  };
}

export async function create(courseData) {
  try {
    const course = await Course.create(courseData);
    return JSON.parse(JSON.stringify(course));
  } catch (err) {
    throw new Error(err);
  }
}
