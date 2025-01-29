
function loadCourseDta() {
    const totalCourse = data.length;
    // Hiển thị tổng số khóa học
    document.getElementById('course-count').textContent = `Số khóa học: ${totalCourse}`;
}

loadCourseDta();