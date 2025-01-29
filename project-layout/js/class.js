// Hàm lấy danh sách lớp học từ các khóa học

let arrClassList = [];
function resetArrClassList() {
    arrClassList = [];
    data.forEach(course => {
        if (course.arrayClass && course.arrayClass.length > 0) {
            const arrayClass = course.arrayClass?.map(clazz => ({
                classId: clazz.classId,
                className: clazz.className,
                descriptions: clazz.descriptions,
                totalNumber: clazz.totalNumber,
                lecturer: clazz.lecturer,
                status: clazz.status,
                courseName: course.courseName,
                courseId: course.courseId
            }));
            arrClassList = arrClassList.concat(arrayClass);
        }
    })
};

// Các ô nhập liệu
let classId = document.getElementById('classId');
let className = document.getElementById('className');
let classTeacherName = document.getElementById('classTeacherName');
let studentCount = document.getElementById('studentCount');
let classDetails = document.getElementById('classDetails');
let selectCourse = document.getElementById('selectCourse');
let classStatus = document.getElementById('classStatus');

// Các nút và bảng
let editButton = document.getElementById('editBtn')
let addRowButton = document.getElementById('addRowBtn');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const modalTitle = document.getElementById('modal-title');
const modal = document.querySelector('.modal');


// JS PHÂN TRANG 
let rowsPerPage = 10;  // Số dòng mỗi trang
let currentPage = 1;  // Trang hiện tại
// Hiển thị bảng dữ liệu
function renderTable(param) {
    let list = []
    if (!param || param.length === 0) {
        list = arrClassList;
    } else {
        list = param
    }
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = list.slice(start, end);

    dataTable.innerHTML = ''; // Xóa dữ liệu cũ
    pageData.forEach((clazz, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${start + index + 1}</td>
            <td>${clazz.classId}</td>
            <td>${clazz.className}</td>
            <td>${clazz.lecturer}</td>
            <td>${clazz.descriptions}</td>
            <td>${clazz.totalNumber}</td>
            <td>${clazz.status}</td>
            <td>${clazz.courseName}</td>
                    <td>
                        <button class="edit">Sửa</button> 
                     </td>
                     <td>
                        <button class="delete">Xóa</button>
                    </td>
            
        `;
        dataTable.appendChild(tr);

        // Lắng nghe sự kiện "Sửa" và "Xóa"
        tr.querySelector('.edit').addEventListener('click', () => editRow(clazz.classId));
        tr.querySelector('.delete').addEventListener('click', () => deleteRow(clazz.classId));
    });
    renderPagination();
}

// Hiển thị phân trang
function renderPagination() {
    const pageCount = Math.ceil(arrClassList.length / rowsPerPage);
    let paginationHTML = '';

    if (pageCount > 1) {
        if (currentPage > 1) {
            paginationHTML += `<a href="#" onclick="changePage(1)"><<</a>`;
            paginationHTML += `<a href="#" onclick="changePage(${currentPage - 1})"><</a>`;
        }

        for (let i = 1; i <= pageCount; i++) {
            paginationHTML += `<a href="#" onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</a>`;
        }

        if (currentPage < pageCount) {
            paginationHTML += `<a href="#" onclick="changePage(${currentPage + 1})">></a>`;
            paginationHTML += `<a href="#" onclick="changePage(${pageCount})">>></a>`;
        }
    }
    pagination.innerHTML = paginationHTML;
}

// Thay đổi trang
function changePage(page) {
    if (page >= 1 && page <= Math.ceil(arrClassList.length / rowsPerPage)) {
        currentPage = page;
        renderTable();
    }
}

// Xử lý nút Thêm dòng
addRowButton.onclick = () => {
    const id = classId.value;
    const name = className.value;
    const teacherName = classTeacherName.value;
    const count = studentCount.value;
    const details = classDetails.value;
    const selectedCourseId = selectCourse.value;
    const status = classStatus.value;

    // Kiểm tra nếu tất cả các thông tin đã được nhập
    if (!id || !name || !teacherName || !count || !details || !status || !selectedCourseId) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    const isExistClassId = arrClassList.some(clazz => clazz.classId === id);
    if (isExistClassId) {
        alert('ID lớp học này đã tồn tại. Vui lòng nhập ID khác!');
        return;
    }

    const newClass = {
        classId: id,
        className: name,
        lecturer: teacherName,
        totalNumber: count,
        descriptions: details,
        status: status
    };

    // Tìm khóa học theo selectedCourseId và thêm lớp học vào arrayClass
    const courseToUpdate = data.find(course => course.courseId === selectedCourseId);

    if (courseToUpdate) {
        // Nếu arrayClass không tồn tại, khởi tạo nó
        if (!courseToUpdate.arrayClass) {
            courseToUpdate.arrayClass = [];
        }

        courseToUpdate.arrayClass.push(newClass);
        localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(data));
        resetArrClassList();
        renderTable();
        alert('Thêm lớp học thành công');
        // Cập nhật lại bảng (renderTable sẽ làm việc ở đây để hiển thị dữ liệu mới)
        modal.style.display = "none";

    } else {
        alert('Không tìm thấy khoá học với ID đã chọn!');
    }
};
// ĐÓNG MODAL
document.querySelectorAll('.modal__body__exit, .modal__inner--btn-exit').forEach(button => {
    button.addEventListener('click', function () {
        if (modal.style.display === 'block' || modal.style.display === '') {
            modal.style.display = 'none';
        }
    });
});

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
// Hiển thị modal Thêm mới
document.getElementById('btn-addnew').addEventListener('click', function () {
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    modalTitle.textContent = 'Modal - Thêm mới Lớp học';
    editButton.style.display = 'none'
    addRowButton.style.display = 'block'
    classId.disabled = false;
    classId.value = '';
    className.value = '';
    classTeacherName.value = '';
    studentCount.value = '';
    classDetails.value = '';
    classStatus.value = '';
    getCourseDropdown();
});
// JS XỬ LÝ NÚT EDIT

// Hàm xử lý khi nhấn nút "Sửa"
let sourceCourseId = ''
function editRow(editClassId) {
    getCourseDropdown();
    addRowButton.style.display = 'none'
    editButton.style.display = 'block'

    // Hiển thị modal
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    // thay doi title cua modal
    modalTitle.textContent = 'Modal-Cập Nhật Lớp Học'
    // Lấy dữ liệu từ arrayClassList 
    resetArrClassList();
    arrClassList.forEach(clazz => {
        if (clazz.classId === editClassId) {
            classId.value = clazz.classId
            className.value = clazz.className
            classTeacherName.value = clazz.lecturer
            studentCount.value = clazz.totalNumber
            classDetails.value = clazz.descriptions
            selectCourse.value = clazz.courseId
            classStatus.value = clazz.status
            classId.disabled = true;
            sourceCourseId = clazz.courseId;
        }
    });
};
// XỬ LÝ NÚT CẬP NHẬT

editButton.onclick = () => { dataUpdate(); };

function dataUpdate() {
    // Lấy dữ liệu của lớp học từ form input
    const idToUpdate = classId.value;
    const nameToUpdate = className.value;
    const teacherNameToUpdate = classTeacherName.value;
    const studentCountToUpdate = studentCount.value;
    const detailsToUpdate = classDetails.value;
    const courseToUpdate = selectCourse.value;
    const statusToUpdate = classStatus.value;



    const updateClass = {
        classId: idToUpdate,
        className: nameToUpdate,
        lecturer: teacherNameToUpdate,
        totalNumber: studentCountToUpdate,
        descriptions: detailsToUpdate,
        status: statusToUpdate

    };

    removeAndUpdateClass(sourceCourseId, courseToUpdate, idToUpdate, updateClass);
    resetArrClassList();
    renderTable();
    alert('Cập nhật khoá học thành công')
    modal.style.display = "none";
}
function removeAndUpdateClass(sourceCourseId, targetCourseId, classId, updatedClassData) {
    // tim khoá học hiện tại 
    const sourceCourse = data.find(course => course.courseId === sourceCourseId);
    if (!sourceCourse) {
        alert('Khoá học nguồn không tồn tại')
        return;
    }
    // tim khoá học đích 
    const targetCourse = data.find(course => course.courseId === targetCourseId);
    if (!targetCourse) {
        alert('khoá học đích không tồn tại')
        return;
    }
    // tìm vị trí lớp học trong khoá học nguồn
    const classIndex = sourceCourse.arrayClass.findIndex(clazz => clazz.classId === classId);
    if (classIndex === -1) {
        alert('lớp học không tồn tại')
        return;
    }
    // Xoá lớp học trong KH nguồn , 
    const [classToMove] = sourceCourse.arrayClass.splice(classIndex, 1);
    //  Cập nhật lại lớp học
    const updatedClass = { ...classToMove, ...updatedClassData }
    targetCourse.arrayClass.push(updatedClass);
    localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(data));

}
resetArrClassList();
renderTable();
// JS NÚT XOÁ 
function deleteRow(classId) {
    // Hiển thị modal
    if (confirmDelete.style.display === 'none' || confirmDelete.style.display === '') {
        confirmDelete.style.display = 'block';
    }
    deleteAction.addEventListener('click', () => {
        for (const course of data) {
            const classIndex = course.arrayClass.findIndex(clazz => clazz.classId === classId);
            if (classIndex !== -1) {
                course.arrayClass.splice(classIndex, 1)
                localStorage.setItem('arrayCourses', JSON.stringify(data));
                alert("Đã xoá thành công")
                resetArrClassList();
                renderTable();
                confirmDelete.style.display = 'none';
                return

            }
        }
        alert("Lớp học không tồn tại")

    })
    // Khi nhấn "Huỷ", đóng modal mà không làm gì
    cancelAction.addEventListener('click', () => {
        confirmDelete.style.display = 'none'; // Ẩn modal
    });
}
/** 
 * JS Ô TÌM KIẾM
 */
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
searchBtn.onclick = () => {
    //　lay du lieu tu o input
    const searchInputValue = searchInput.value.toLowerCase();
    arrClassList = searchClass(searchInputValue)


    if (!arrClassList || arrClassList.length === 0) {
        alert(" Không có kết quả nào phù hợp, vui lòng nhập lại")
    } else {
        changePage(1);
        renderTable();
        renderPagination();
    }
};
function searchClass(searchInputValue) {
    const result = [];
    data.forEach(course => {
        course.arrayClass?.forEach(clazz => {
            if (
                clazz.classId.toLowerCase().includes(searchInputValue) ||
                clazz.className.toLowerCase().includes(searchInputValue) ||
                clazz.descriptions.toLowerCase().includes(searchInputValue) ||
                clazz.totalNumber.toLowerCase().includes(searchInputValue) ||
                clazz.lecturer.toLowerCase().includes(searchInputValue) ||
                clazz.status.toLowerCase().includes(searchInputValue) ||
                course.courseName.toLowerCase().includes(searchInputValue)) {
                result.push({
                    ...clazz,
                    courseName: course.courseName,
                    courseId: course.courseId
                })
            }
        })
    })
    return result

}
/**
 * JS XỬ LÍ LỰA CHỌN SẮP XẾP THEO TĂNG DẦN HOẶC GIẢM DẦN
 */

// Lắng nghe sự kiện thay đổi của dropdown sắp xếp
document.getElementById('sortSelect').addEventListener('change', (event) => {
    let sortOrder = event.target.value;
    let sortedClass = sortClassName(sortOrder);
    renderTable(sortedClass);
    renderPagination();
});

function sortClassName(order) {
    let sortedList = []
    const rows = dataTable.querySelectorAll('tr');
    for (const row of rows) {
        const classId = row.children[1].textContent;
        const className = row.children[2].textContent;
        const lecturer = row.children[3].textContent;
        const descriptions = row.children[4].textContent;
        const totalNumber = row.children[5].textContent;
        const status = row.children[6].textContent;
        const courseName = row.children[7].textContent;
        sortedList.push({
            classId: classId,
            className: className,
            lecturer: lecturer,
            descriptions: descriptions,
            totalNumber: totalNumber,
            status: status,
            courseName: courseName
        })
    }

    changePage(1)
    sortedList.sort((a, b) => {
        const nameA = a.className.toLowerCase();
        const nameB = b.className.toLowerCase();

        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    return sortedList;
}