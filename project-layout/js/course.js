

//JS TABLE NHẬP DỮ LIỆU KHOÁ HỌC
let idInput = document.getElementById('courseId');
let nameInput = document.getElementById('courseName');
let timeInput = document.getElementById('courseTime');
let statusInput = null
let editButton = document.getElementById('editBtn')
let addRowButton = document.getElementById('addRowBtn');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const modalTitle = document.getElementById('modal-title')

// JavaScript để hiển thị modal THEM MOI
// hien thi modal
const modal = document.querySelector('.modal');
document.getElementById('btn-addnew').addEventListener('click', function () {
    modalTitle.textContent = 'Modal- Thêm mới khoá học'
    editButton.style.display = 'none'
    addRowButton.style.display = 'block'
    idInput.disabled = false;
    idInput.value = '';
    nameInput.value = '';
    timeInput.value = '';
    document.querySelectorAll('input[name="check"]').forEach(radio => radio.checked = false);

    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
});
// dong modal
document.querySelectorAll('.modal__body__exit, .modal__inner--btn-exit').forEach(button => {
    button.addEventListener('click', function () {
        if (modal.style.display === 'block' || modal.style.display === '') {
            modal.style.display = 'none';
        }
    });
});


// Xử lý nút Thêm dòng
addRowButton.onclick = () => {
    const id = idInput.value;
    const name = nameInput.value;
    const time = timeInput.value;
    const status = document.querySelector('input[name="check"]:checked')?.value;

    if (!id || !name || !time || !status) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    // check input ID 
    const isExistCourse = data.some(course => course.courseId === id)
    if (isExistCourse) {
        alert('id đã tồn tại, vui lòng nhập lại');
        return;
    }
    const newCourse = {
        courseId: id,
        courseName: name,
        courseTime: time,
        status: status
    }
    data.push(newCourse)
    localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(data));
    alert('Thêm khoá học thành công')
    window.location.reload();
};

// JS XỬ LÝ NÚT EDIT
// Hàm xử lý khi nhấn nút "Sửa"
function editRow(row) {
    // Hiển thị modal
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
    // thay doi title cua modal
    modalTitle.textContent = 'Modal-Cập Nhật Khoá Học'
    // Lấy dữ liệu từ các ô trong dòng và gán vào modal (input)
    const id = row.children[1].textContent;
    const name = row.children[2].textContent;
    const time = row.children[3].textContent;
    const status = row.children[4].textContent;

    // Gán dữ liệu vào các ô input
    idInput.value = id;
    nameInput.value = name;
    timeInput.value = time;
    // statusInput = status;
    //stt o day dang la hoat dong , hoac khong hoat dong
    var radio1 = document.getElementById("active");
    var radio2 = document.getElementById("inactive");
    if (status === "Hoạt động") {
        radio1.checked = true;

    } else {
        radio2.checked = true;
    }
    idInput.disabled = true
    addRowButton.style.display = 'none'
    editButton.style.display = 'block'
}
editButton.onclick = () => { dataUpdate() }
function dataUpdate() {
    // lay du lieu cua khoa hoc
    // lap qua tung khoa hoc
    data.forEach((course) => {
        // neu nhu trung id thi xu li du lieu, lay DL moi ghi de len DL cu
        if (course.courseId === idInput.value) {
            course.courseId = course.courseId;
            course.courseName = nameInput.value;
            course.courseTime = timeInput.value;
            course.status = document.querySelector('input[name="check"]:checked')?.value
        }
    })

    const editedData = [...data];
    //luu lai vao local
    localStorage.setItem(COURSE_DATA_KEY, JSON.stringify(editedData))
    window.location.reload();

}
// JS NÚT DELETE
function deleteRow(key, id) {
    // Hiển thị modal
    if (confirmDelete.style.display === 'none' || confirmDelete.style.display === '') {
        confirmDelete.style.display = 'block';
    }
    // Khi nhấn "Xoá", thực hiện hành động xóa dòng
    deleteAction.addEventListener('click', () => {
        const localStorageData = JSON.parse(localStorage.getItem('arrayCourses') || [])
        const filterdList = localStorageData.filter(item => item[key] != id)
        localStorage.setItem('arrayCourses', JSON.stringify(filterdList));
        window.location.reload();
    });

    // Khi nhấn "Huỷ", đóng modal mà không làm gì
    cancelAction.addEventListener('click', () => {
        confirmDelete.style.display = 'none'; // Ẩn modal
    });
};

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
/** 
 * JS Ô TÌM KIẾM
 */
searchBtn.onclick = () => {
    //　lay du lieu tu o input
    const searchInputValue = searchInput.value.toLowerCase();
    let courseList = [];
    // tu khoa nhap vao co trung voi id cua khoa hoc khog, neu trung th hien thi.

    courseList = searchCourse(data, 'courseId', searchInputValue)

    if (!courseList || courseList.length === 0) {
        // kiem tra ten khoa hoc
        courseList = searchCourse(data, 'courseName', searchInputValue)
    }
    if (!courseList || courseList.length === 0) {
        courseList = searchCourse(data, 'courseTime', searchInputValue)
    }
    if (!courseList || courseList.length === 0) {
        courseList = searchCourse(data, 'status', searchInputValue)
    }
    if (!courseList || courseList.length === 0) {
        alert(" Không có kết quả nào phù hợp, vui lòng nhập lại")
    } else {
        console.log('danh sach', courseList)
        changePage(1);
        renderTable(courseList);
        renderPagination(courseList);
    }
};

function searchCourse(data, key, condition) {
    let result = [];
    // !condition thi tra ve data ..
    if (condition) {
        const lowerCaseCondition = condition.toLowerCase(); // Chuyển điều kiện tìm kiếm thành chữ thường
        result = data.filter(item => item[key]?.toString().toLowerCase().includes(lowerCaseCondition)); // Chuyển item[key] thành chữ thường và so sánh
        return result;
        // return data.filter(item => item[key]?.includes(condition));
    } else {
        result = data;
    }
    return result;
}

/**
 * JS XỬ LÍ LỰA CHỌN SẮP XẾP THEO TĂNG DẦN HOẶC GIẢM DẦN
 */

// Hàm sắp xếp dữ liệu theo tên khóa học
let filteredCourses = [...data];;
function sortData(data, order) {

    changePage(1);
    const sortedData = [...data]; // Sao chép dữ liệu để không làm thay đổi dữ liệu gốc

    sortedData.sort((a, b) => {
        const nameA = a.courseName.toLowerCase();
        const nameB = b.courseName.toLowerCase();

        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    arrSorted = sortedData;
    return sortedData;
}

// Lắng nghe sự kiện thay đổi của dropdown sắp xếp
document.getElementById('sortSelect').addEventListener('change', (event) => {
    sortOrder = event.target.value;
    let sortedCourses = sortData(filteredCourses, sortOrder);
    renderTable(sortedCourses);
});

// JS PHÂN TRANG 
let rowsPerPage = 10;  // Số dòng mỗi trang
let currentPage = 1;  // Trang hiện tại

// Hàm thêm dòng vào dữ liệu (giả sử là dữ liệu động)

// Hàm render bảng
function renderTable(param) {
    let list = []
    if (!param || param.length === 0) {
        list = data;
    } else {
        list = param
    }
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';  // Xóa nội dung hiện tại trong bảng
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = list.slice(start, end);

    // Thêm dữ liệu vào bảng
    pageData.forEach((course, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${course.courseId}</td>
                    <td>${course.courseName}</td>
                    <td>${course.courseTime}</td>
                    <td>${course.status}</td>
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

    });
}

// Hàm render thanh phân trang
function renderPagination(param) {
    let list = []
    if (!param || param.length === 0) {
        list = data
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
let arrSorted = [];
// Hàm chuyển trang
function changePage(page) {
    if (page >= 1 && page <= Math.ceil(data.length / rowsPerPage)) {
        currentPage = page;
        renderTable(arrSorted);
        renderPagination();
    }
}


renderTable();  // Render bảng ban đầu
renderPagination();  // Render thanh phân trang ban đầu





