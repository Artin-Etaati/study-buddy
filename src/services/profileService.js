
import { supabase } from './supabase';

export async function getUniversities() {
  const { data, error } = await supabase
    .from('universities')
    .select('*');

  if (error) {
    throw error;
  }

  return data;
}

export const getMajors = async () => {
  const { data, error } = await supabase
    .from('majors')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
};





export async function saveProfile(formData, courses, userId) {

  // 1. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      university_id: formData.university,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      birthday: formData.birthday,
      gender: formData.gender,
      major: formData.major.trim(),
      study_style: formData.studyStyle,
    });

  if (profileError) {
    throw profileError;
  }

  // 2. Map courses as objects for insertion into course table
  const courseRows = courses.map((course) => ({
    university_id: formData.university,
    course_code: course
  }));

  // 3. Save courses to course table
  const { error: courseError } = await supabase
    .from('courses')
    .upsert(courseRows, {
      onConflict: 'university_id,course_code',
      ignoreDuplicates: true
    });

  if (courseError) {
    throw courseError;
  }
  //get only the users course codes out of courserows
  const courseCodes = courseRows.map(
    (course) => course.course_code
  );

  // 4. Get course IDs that match with users courses to save in user course table
  const { data: savedCourses, error: fetchError } = await supabase
    .from('courses')
    .select('id')
    .eq('university_id', formData.university)
    .in('course_code', courseCodes);

  if (fetchError) {
    throw fetchError;
  }

  // 5. Connect courses to user
  const userCourseRows = savedCourses.map((course) => ({
    user_id: userId,
    course_id: course.id
  }));

  const { error: userCourseError } = await supabase
    .from('user_courses')
    .insert(userCourseRows);

  if (userCourseError) {
    throw userCourseError;
  }
}
