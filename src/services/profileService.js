
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
    .upsert({
      id: userId,
      university_id: formData.university,
      major_id: formData.major,
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      birthday: formData.birthday,
      gender: formData.gender,
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
    .upsert(userCourseRows, {
      onConflict: 'user_id,course_id',
      ignoreDuplicates: true
    });

  if (userCourseError) {
    throw userCourseError;
  }
}



export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      first_name,
      last_name,
      birthday,
      gender,
      study_style,
      university_id,
      major_id,
      profile_picture_name,
      universities(name),
      majors(name),
      user_courses(
        course_id,
        courses(id, course_code)
      )
    `)
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}




export async function updateProfile(userId, formData) {
  // 1. Update personal information
  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: formData.firstName.trim(),
      last_name: formData.lastName.trim(),
      birthday: formData.birthday,
      gender: formData.gender,
      study_style: formData.studyStyle,
      major_id: formData.major
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;

  // 2. Update courses only if they changed
  if (formData.coursesChanged) {
    const courseCodes = [
      ...new Set(
        formData.courses.map((course) =>
          course.trim().toUpperCase()
        )
      )
    ];

    if (
      courseCodes.length === 0 ||
      courseCodes.some((code) => !code)
    ) {
      throw new Error('At least one course is required.');
    }

    // 3. Make sure selected courses exist
    const courseRows = courseCodes.map((course_code) => ({
      university_id: data.university_id,
      course_code
    }));

    const { error: courseError } = await supabase
      .from('courses')
      .upsert(courseRows, {
        onConflict: 'university_id,course_code',
        ignoreDuplicates: true
      });

    if (courseError) throw courseError;

    // 4. Get selected course IDs
    const { data: selectedCourses, error: fetchError } = await supabase
      .from('courses')
      .select('id')
      .eq('university_id', data.university_id)
      .in('course_code', courseCodes);

    if (fetchError) throw fetchError;

    if (selectedCourses.length !== courseCodes.length) {
      throw new Error('Could not find all selected courses.');
    }

    const selectedIds = selectedCourses.map(
      (course) => course.id
    );

    // 5. Get user's existing course IDs
    const { data: existingCourses, error: existingError } = await supabase
      .from('user_courses')
      .select('course_id')
      .eq('user_id', userId);

    if (existingError) throw existingError;

    const existingIds = existingCourses.map(
      (course) => course.course_id
    );

    // 6. Find courses to add and remove
    const idsToAdd = selectedIds.filter(
      (id) => !existingIds.includes(id)
    );

    const idsToRemove = existingIds.filter(
      (id) => !selectedIds.includes(id)
    );

    // 7. Add new course relationships
    if (idsToAdd.length > 0) {
      const rows = idsToAdd.map((course_id) => ({
        user_id: userId,
        course_id
      }));

      const { error: insertError } = await supabase
        .from('user_courses')
        .upsert(rows, {
          onConflict: 'user_id,course_id',
          ignoreDuplicates: true
        });

      if (insertError) throw insertError;
    }

    // 8. Remove deselected course relationships
    if (idsToRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from('user_courses')
        .delete()
        .eq('user_id', userId)
        .in('course_id', idsToRemove);

      if (deleteError) throw deleteError;
    }
  }

  return data;
}
