// Load dữ liệu từ Local Storage
const STUDENT_DATA_KEY = 'studentData'

function getAllStudents(arrayCourses) {
    let allStudents = [];
    arrayCourses.forEach(course => {
        course.arrayClass.forEach(classItem => {
            classItem.arrayStudent.map(student => {
                let studentObj = {
                    ...student,
                    classId: classItem.classId,
                    className: classItem.className
                }
                allStudents.push(studentObj)
            })
        });
    });

    return allStudents;
}

// Các ô nhập liệu
let studentId = document.getElementById('studentId')
let studentName = document.getElementById('studentName')
let year = document.getElementById('year')
let address = document.getElementById('address')
let email = document.getElementById('email')
let phone = document.getElementById('phone')
const selectClass = document.getElementById("selectClass")
const selectCourse = document.getElementById("selectCourse")
const selectStatus = document.getElementById("selectStatus");

// Các nút và bảng
let editButton = document.getElementById('editBtn')
let addRowButton = document.getElementById('addRowBtn');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const modalTitle = document.getElementById('modal-title');
const modal = document.querySelector('.modal');
function getCourseDropdown() {
    selectCourse.innerHTML = '';
    // Thêm option mặc định "Chọn khóa học"
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Chọn khóa học';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectCourse.appendChild(defaultOption);

    data.forEach(course => {
        const option = document.createElement('option');
        option.value = course.courseId;
        option.text = course.courseName;
        selectCourse.appendChild(option);

    });
};
// 

selectCourse.onchange = function (e) {
    const courseId = e.target.value
    getClassDropdown(courseId)
}
function getClassDropdown(courseId) {
    selectClass.innerHTML = '';
    // Thêm option mặc định "Chọn khóa học"
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Chọn lớp học';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectClass.appendChild(defaultOption);

    data.forEach(course => {
        // Giả sử mỗi course có một mảng classes (mỗi lớp học trong course)

        if (course.courseId === courseId && course.arrayClass && Array.isArray(course.arrayClass)) {
            course.arrayClass.forEach(classItem => {
                // Tạo option cho từng lớp học
                const classOption = document.createElement('option');
                classOption.value = classItem.classId; // Id của lớp học
                classOption.text = classItem.className; // Tên lớp học
                selectClass.appendChild(classOption); // Giả sử bạn có một select element cho lớp học
            });
        }
    });

};

// Hiển thị modal Thêm mới
document.getElementById('btn-addnew').addEventListener('click', function () {
    modalTitle.textContent = 'Modal - Thêm mới Lớp học';
    editButton.style.display = 'none'
    addRowButton.style.display = 'block'
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    getClassDropdown();
    getCourseDropdown();
});

// Đóng modal
document.querySelectorAll('.modal__body__exit, .modal__inner--btn-exit').forEach(button => {
    button.addEventListener('click', function () {
        if (modal.style.display === 'block' || modal.style.display === '') {
            modal.style.display = 'none';
        }
    });
});

// Xử lý nút Thêm dòng
addRowButton.onclick = () => {

    let sex = document.querySelector('input[name="sex"]:checked')
    if (!studentId.value || !studentName.value || !year.value || !address.value || !email.value || !phone.value || !sex?.value) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    // check input ID 
    const isExistClass = data.some(student => student.studentId === studentId.value)
    if (isExistClass) {
        alert('id đã tồn tại, vui lòng nhập lại');
        return;
    }
    const newStudent = {
        studentId: studentId.value,
        studentName: studentName.value,
        year: year.value,
        address: address.value,
        email: email.value,
        phone: phone.value,
        sex: sex.value,
        status: getStatusByValue(selectStatus.value)
    }

    const selectedCourseId = selectCourse.value;
    const selectedClassId = selectClass.value;
    const selectedStudentId = studentId.value;

    let existedCourse = data.find(course => course.courseId === selectedCourseId);
    if (!existedCourse) {
        alert('Khoá học không tồn tại');
        return;
    }

    let existedClass = existedCourse.arrayClass.find(clazz => clazz.classId === selectedClassId);
    if (!existedClass) {
        alert('Lớp học không tồn tại');
        return;
    }

    let existedStudent = existedClass.arrayStudent.find(student => student.studentId === selectedStudentId)
    if (existedStudent || existedStudent != undefined) {
        alert("Mã sinh viên đã tồn tại, vui lòng nhập mã sinh viên khác");
        return;
    }

    existedClass.arrayStudent.push(newStudent);
    existedClass.totalNumber = existedClass.arrayStudent.length;
    localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(data))
    alert("Đã thêm học sinh thành công")
    renderTable();
    modal.style.display = 'none';
};

const statusData = [
    { value: "01", text: "Chờ lớp" },
    { value: "02", text: "Đang học" },
    { value: "03", text: "Bảo lưu" },
    { value: "04", text: "Đình chỉ" },
    { value: "05", text: "Tốt nghiệp" }
]
function getStatus(cond, isValue) {
    let status = "";
    let result = "";

    if (isValue) {
        status = statusData.find(status => status.value === cond);
        result = status ? status.text : "";
    } else {
        status = statusData.find(status => status.text === cond);
        result = status ? status.value : "";
    }
    return result;
}

function dataUpdate() {
    // Lấy dữ liệu của lớp học từ form input
    const studentId = studentIdValue;
    const studentName = studentNameValue;
    const year = yearValue;
    const address = addressValue;
    const email = emailValue;
    const phone = phoneValue;
    const sex = sexValue;

    // Lặp qua mảng data và tìm lớp học có id trùng với id cần cập nhật
    data.forEach((student) => {
        // Nếu tìm thấy lớp học có ID trùng với ID cần cập nhật
        if (student.studentId === studentId) {
            // Cập nhật thông tin lớp học với giá trị mới từ form
            student.studentId = student.studentId;
            student.studentName = studentName;
            student.year = year;
            student.address = address;
            student.email = email;
            student.phone = phone;
            student.sex = sex;
        }
    });

    //Lưu lại dữ liệu mới vào LocalStorage
    localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(data));
    // Tải lại trang để cập nhật bảng hiển thị
    window.location.reload();
}

// Hàm render bảng
function renderTable(param) {
    let list = []
    if (!param || param.length === 0) {
        list = getAllStudents(data);
    } else {
        list = param
    }
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';  // Xóa nội dung hiện tại trong bảng
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = list.slice(start, end);

    // Thêm dữ liệu vào bảng
    pageData.forEach((student, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.studentId}</td>
                    <td>${student.studentName}</td>
                    <td>${student.year}</td>
                    <td>${student.address}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.status}</td>
                    <td>${student.className}</td>
                    <td>
                        <button class="edit">Sửa</button> 
                     </td>
                     <td>
                        <button class="delete">Xóa</button>
                    </td>
                `;

        tbody.appendChild(tr);
        tr.querySelector('.edit').addEventListener('click', () => editRow(tr));
        tr.querySelector('.delete').addEventListener('click', () => deleteRow('courseId', course.courseId));

        getClassDropdown();

    });
}

function editRow(row) {
    // Hiển thị modal
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    // thay doi title cua modal
    modalTitle.textContent = 'Modal-Cập Nhật Thông tin sinh viên'

    // Lấy dữ liệu từ các ô trong dòng và gán vào modal (input)
    studentId.value = row.children[1].textContent;
    studentName.value = row.children[2].textContent;
    year.value = row.children[3].textContent;
    address.value = row.children[4].textContent;
    email.value = row.children[5].textContent;
    phone.value = row.children[6].textContent;
    console.log(row.children[7]);
    selectStatus.value = getStatusByText(row.children[7].textContent);

    //stt o day dang la hoat dong , hoac khong hoat dong
    // var radio1 = document.getElementById("active");
    // var radio2 = document.getElementById("inactive");
    // if (status === "Hoạt động") {
    //     radio1.checked = true;

    // } else {
    //     radio2.checked = true;
    // }
    // idInput.disabled = true
    addRowButton.style.display = 'none'
    editButton.style.display = 'block'
}

// JS PHÂN TRANG 
let rowsPerPage = 10;  // Số dòng mỗi trang
let currentPage = 1;  // Trang hiện tại

// Hàm render thanh phân trang
function renderPagination(param) {
    let list = []
    if (!param || param.length === 0) {
        list = getAllStudents(data)
    } else {
        list = param
    }
    const pagination = document.getElementById('pagination');
    const pageCount = Math.ceil(list.length / rowsPerPage); // Tính tổng số trang

    // Hiển thị phân trang nếu có dữ liệu
    if (pageCount > 1) {
        let paginationHTML = '';

        // Nút "Previous"
        if (currentPage > 1) {
            paginationHTML += `<a href="#" onclick="changePage(1)"><<</a>`;
            paginationHTML += `<a href="#" onclick="changePage(${currentPage - 1})"><</a>`;
        }

        // Nút trang (1, 2, 3, ...)
        for (let i = 1; i <= pageCount; i++) {
            paginationHTML += `<a href="#" onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }

        // Nút "Next"
        if (currentPage < pageCount) {
            paginationHTML += `<a href="#" onclick="changePage(${currentPage + 1})">></a>`;
            paginationHTML += `<a href="#" onclick="changePage(${pageCount})">>></a>`;
        }

        pagination.innerHTML = paginationHTML;
    } else {
        pagination.innerHTML = '';  // Không hiển thị phân trang nếu chỉ có 1 trang
    }
}

// Hàm chuyển trang
function changePage(page) {
    if (page >= 1 && page <= Math.ceil(getAllStudents(data).length / rowsPerPage)) {
        currentPage = page;
        renderTable();
        renderPagination();
    }
}

renderTable();
renderPagination();
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
