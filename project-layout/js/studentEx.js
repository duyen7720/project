// Các ô nhập liệu
const studentId = document.getElementById('studentId')
const studentName = document.getElementById('studentName')
const year = document.getElementById('year')
const address = document.getElementById('address')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const maleRadio = document.getElementById("male")
const femaleRadio = document.getElementById("female")
const selectClass = document.getElementById("selectClass")
const selectCourse = document.getElementById("selectCourse")
const selectStatus = document.getElementById("selectStatus")
const hiddenInputs = document.querySelectorAll('.hidden')
const disabledCourse = document.getElementById("disabledCourse")
const disabledClass = document.getElementById("disabledClass")

// Các nút và bảng
let editButton = document.getElementById('editBtn')
let addRowButton = document.getElementById('addRowBtn');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const modalTitle = document.getElementById('modal-title');
const modal = document.querySelector('.modal');

function getAllStudents(arrayCourses) {
    let allStudents = [];
    arrayCourses.forEach(course => {
        course.arrayClass.forEach(classItem => {
            classItem.arrayStudent.map(student => {
                let studentObj = {
                    ...student,
                    classId: classItem.classId,
                    className: classItem.className,
                    courseId: course.courseId,
                    courseName: course.courseName
                }
                allStudents.push(studentObj)
            })
        });
    });

    return allStudents;
}

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
    initValue()
    modalTitle.textContent = 'Modal - Thêm mới Học sinh';
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
        status: getStatusText(selectStatus.value)
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
    renderPagination();
    modal.style.display = 'none';
};

const statusData = [
    { value: "01", text: "Chờ lớp" },
    { value: "02", text: "Đang học" },
    { value: "03", text: "Bảo lưu" },
    { value: "04", text: "Đình chỉ" },
    { value: "05", text: "Tốt nghiệp" }
]
function getStatusValue(text) {
    let value = "";
    const status = statusData.find(statusItem => statusItem.text === text);
    if (status) {
        value = status.value
    }
    return value;
}
function getStatusText(value) {
    let text = "";
    const status = statusData.find(statusItem => statusItem.value === value);
    if (status) {
        text = status.text;
    }
    return text;
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
        tr.querySelector('.edit').addEventListener('click', () => editRow(student.studentId));
        tr.querySelector('.delete').addEventListener('click', () => deleteRow(student.studentId));

        getClassDropdown();

    });
}

let updCourseId = ""
let updClassId = ""
function editRow(selectedStudentId) {
    // Hiển thị modal
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    // thay doi title cua modal
    modalTitle.textContent = 'Modal-Cập Nhật Thông tin sinh viên'

    // Disable các hạng mục
    selectCourse.disabled = true;
    selectClass.disabled = true;
    studentId.disabled = true;

    // Ẩn / hiện các hạng mục
    selectCourse.style.display = "none"
    selectClass.style.display = "none"
    for (const hiddenInput of hiddenInputs) {
        hiddenInput.style.display = "inline-block"
    }

    // Lấy dữ liệu từ các ô trong dòng và gán vào modal (input)
    const studentList = getAllStudents(data);
    studentList.map(student => {
        if (student.studentId === selectedStudentId) {
            studentId.value = selectedStudentId;
            studentName.value = student.studentName;
            year.value = student.year;
            address.value = student.address;
            email.value = student.email;
            phone.value = student.phone;
            selectStatus.value = getStatusValue(student.status);
            disabledCourse.value = student.courseName;
            disabledClass.value = student.className;
            if (student.sex === "Nam") {
                maleRadio.checked = true;
            } else {
                femaleRadio.checked = true;
            }
            updCourseId = student.courseId;
            updClassId = student.classId;
        }
    })

    addRowButton.style.display = 'none'
    editButton.style.display = 'block'

    // alert("Cập nhật thành công")
}

editButton.onclick = () => {
    data.map((course) => {
        if (course.courseId === updCourseId) {
            course.arrayClass.map(clazz => {
                if (clazz.classId === updClassId) {
                    clazz.arrayStudent.map(student => {
                        if (student.studentId === studentId.value) {
                            student.studentId = student.studentId;
                            student.studentName = studentName.value;
                            student.year = year.value;
                            student.address = address.value;
                            student.email = email.value;
                            student.phone = phone.value;
                            student.status = getStatusText(selectStatus.value);
                            if (maleRadio.checked) {
                                student.sex = "Nam";
                            } else {
                                student.sex = "Nữ";
                            }
                        }
                    })
                }
            })
        }
    })

    const editedData = [...data];
    //luu lai vao local
    localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(editedData))
    alert("Cập nhật thành công")
    window.location.reload();

}

// JS NÚT DELETE
function deleteRow(studentId) {
    // Hiển thị modal
    if (confirmDelete.style.display === 'none' || confirmDelete.style.display === '') {
        confirmDelete.style.display = 'block';
    }
    // Khi nhấn "Xoá", thực hiện hành động xóa dòng
    deleteAction.addEventListener('click', () => {
        data.forEach(course => {
            course.arrayClass.forEach(clazz => {
                clazz.arrayStudent = clazz.arrayStudent.filter(student => student.studentId !== studentId);
            });
        });
        localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(data));
        alert("Xóa thành công")
        window.location.reload();
    });

    // Khi nhấn "Huỷ", đóng modal mà không làm gì
    cancelAction.addEventListener('click', () => {
        confirmDelete.style.display = 'none'; // Ẩn modal
    })
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

    initValue();
}

function initValue() {

    for (const hiddenInput of hiddenInputs) {
        hiddenInput.style.display = "none"
    }

    selectCourse.style.display = "inline-block"
    selectClass.style.display = "inline-block"

    studentId.value = ""
    studentId.disabled = false;
    studentName.value = ""
    year.value = ""
    address.value = ""
    email.value = ""
    phone.value = ""
    maleRadio.checked = true
    selectClass.value = ""
    selectClass.disabled = false
    selectCourse.value = ""
    selectCourse.disabled = false
    selectStatus.value = "01"

}

// Hàm chuyển trang
function changePage(page) {
    if (page >= 1 && page <= Math.ceil(getAllStudents(data).length / rowsPerPage)) {
        currentPage = page;
        renderTable();
        renderPagination();
    }
}

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = () => {
    const searchCond = searchInput.value;
    let result = searchStudent("studentId", searchCond)
        || searchStudent("studentName", searchCond)
        || searchStudent("year", searchCond)
        || searchStudent("address", searchCond)
        || searchStudent("email", searchCond)
        || searchStudent("phone", searchCond)
        || searchStudent("status", searchCond)
        || searchStudent("className", searchCond)

    renderTable(result);
    renderPagination(result);
    changePage(1);
}

function searchStudent(key, condition) {
    let result = [];
    let studentList = getAllStudents(data);
    if (condition) {
        const lowerCaseCondition = condition.toLowerCase();
        result = studentList.filter(item => item[key]?.toString().toLowerCase().includes(lowerCaseCondition));
    } else {
        result = studentList;
    }
    return result;
}

renderTable();
renderPagination();