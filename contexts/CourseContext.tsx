// contexts/CourseContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CourseService } from "../services/course.service";
import { Course, Word } from "../types/database";

interface CourseContextType {
  courses: Course[];
  currentCourse: Course | null;
  currentWords: Word[];
  loading: boolean;
  error: string | null;
  setCourseById: (courseId: number) => Promise<void>;
  refreshCourses: () => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCourses = useCallback(async () => {
    try {
      setLoading(true);
      const coursesData = await CourseService.getCourses();
      setCourses(coursesData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const setCourseById = useCallback(async (courseId: number) => {
    try {
      setLoading(true);
      const [course, words] = await Promise.all([
        CourseService.getCourseById(courseId),
        CourseService.getWordsByCourseId(courseId),
      ]);

      setCurrentCourse(course);
      setCurrentWords(words);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        currentCourse,
        currentWords,
        loading,
        error,
        setCourseById,
        refreshCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourse must be used within CourseProvider");
  }
  return context;
};
