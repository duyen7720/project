// Function to create a new student
function createStudent(studentId, studentName, year, address, email, phone, sex, status) {
    return {
        studentId: studentId,
        studentName: studentName,
        year: year,
        address: address,
        email: email,
        phone: phone,
        sex: sex,
        status: status
    };
}

// Function to add a student to an existing class in a course
function addStudentToAvailableClass(courseId, classId, newStudent) {
    // Retrieve the existing courses from localStorage
    let courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Find the course by courseId
    let course = courses.find(course => course.courseId === courseId);
    if (!course) {
        console.error(`Course with ID ${courseId} not found.`);
        return;
    }

    // Find the class within the course by classId
    let classItem = course.arrayClass.find(classItem => classItem.classId === classId);
    if (!classItem) {
        console.error(`Class with ID ${classId} not found in Course ${courseId}.`);
        return;
    }

    // Add the new student to the class
    classItem.arrayStudent.push(newStudent);

    // Update the total number of students in the class
    classItem.totalNumber = classItem.arrayStudent.length;

    // Save the updated courses back to localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    console.log(`New student added to Class ${classId} in Course ${courseId}`);
}

// Example: Create a new student
const newStudent = createStudent(
    'S17',
    'Student 17',
    1,
    'Address 17',
    'student17@example.com',
    '0907777777',
    'Female',
    'Active'
);

// Assuming we have existing courses in localStorage already, let's add the new student to a specific class
// Add the new student to Class 1 (C1) in Course 1 (Course1)
addStudentToAvailableClass('Course1', 'C1', newStudent);

// Retrieve and log the updated courses from localStorage to verify
const storedCourses = JSON.parse(localStorage.getItem('courses'));
console.log(storedCourses);
