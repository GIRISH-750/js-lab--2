
/* Section 06 — From state to screen: views */

/* What one course card shows. */
export function cardView(course, planner) {
  const inPlanner = planner.some((item) => item.id === course.id);

  return {
    id: course.id,
    heading: `${course.code} · ${course.title}`,
    meta: `${course.credits} credits · ${course.department}`,
    seats:
      course.seatsLeft === 0
        ? "Full"
        : course.seatsLeft === 1
          ? "1 seat left"
          : `${course.seatsLeft} seats left`,
    inPlanner,
    buttonLabel: inPlanner ? "Remove" : "Add",
    disabled: course.seatsLeft === 0 && !inPlanner,
  };
}

/* The planner summary. */
export function summaryView(planner) {
  const count = planner.length;

  const credits = planner.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  const text =
    count === 0
      ? "Nothing planned yet"
      : `${count} ${count === 1 ? "course" : "courses"} · ${credits} credits`;

  return {
    count,
    credits,
    overLimit: credits > 24,
    text,
  };
}

/* The status line above the list. */
export function statusView(state) {
  if (state.status === "loading") {
    return {
      message: "Loading courses…",
      showRetry: false,
    };
  } else if (state.status === "error") {
    return {
      message: `Couldn't load courses: ${state.error}`,
      showRetry: true,
    };
  } else if (state.status === "ready" && state.courses.length === 0) {
    return {
      message: "No courses match.",
      showRetry: false,
    };
  }

  return {
    message: "",
    showRetry: false,
  };
}

/* Grade points on a 10-point scale. */
export const GRADE_POINTS = Object.freeze({
  A: 10,
  "A-": 9,
  B: 8,
  "B-": 7,
  C: 6,
  D: 5,
  F: 0,
});

/* The SGPA calculator. */
export function sgpaView(planner, grades) {
  const gradedCourses = planner.filter(
    (course) => grades[course.id] !== undefined
  );

  const graded = gradedCourses.length;
  const total = planner.length;

  const credits = gradedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  const points = gradedCourses.reduce(
    (sum, course) =>
      sum + course.credits * GRADE_POINTS[grades[course.id]],
    0
  );

  const sgpa =
    graded === 0
      ? null
      : Math.round((points / credits) * 100) / 100;

  let text;

  if (total === 0) {
    text = "Add courses to the planner first";
  } else if (graded === 0) {
    text = "Pick a grade to see your SGPA";
  } else if (graded === total) {
    text = `SGPA ${sgpa.toFixed(2)}`;
  } else {
    text = `SGPA ${sgpa.toFixed(2)} · ${graded} of ${total} courses graded`;
  }

  return {
    graded,
    total,
    credits,
    sgpa,
    text,
  };
}
