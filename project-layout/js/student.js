// Load dữ liệu từ Local Storage
const STUDENT_DATA_KEY = 'studentData'
// let data = JSON.parse(localStorage.getItem(STUDENT_DATA_KEY)) || [];

// Các ô nhập liệu
let studentId = document.getElementById('studentId')
let studentName = document.getElementById('studentName')
let year = document.getElementById('year')
let address = document.getElementById('address')
let email = document.getElementById('email')
let phone = document.getElementById('phone')

// Các nút và bảng
let editButton = document.getElementById('editBtn')
let addRowButton = document.getElementById('addRowBtn');
const dataTable = document.getElementById('dataTable').querySelector('tbody');
const modalTitle = document.getElementById('modal-title');
const modal = document.querySelector('.modal');

// Hiển thị modal Thêm mới
document.getElementById('btn-addnew').addEventListener('click', function () {
    modalTitle.textContent = 'Modal - Thêm mới Lớp học';
    editButton.style.display = 'none'
    addRowButton.style.display = 'block'
    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    }
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
        sex: sex.value
    }

    data.push(newStudent);
    localStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(data))
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
    modalTitle.textContent = 'Modal-Cập Nhật Lớp Học'
    // Lấy dữ liệu từ các ô trong dòng và gán vào modal (input)

    studentId.value = row.children[1].textContent;
    studentName.value = row.children[2].textContent;
    year.value = row.children[3].textContent;
    address.value = row.children[4].textContent;
    email.value = row.children[5].textContent;
    phone.value = row.children[6].textContent;
    let sex = document.querySelector('input[name="sex"]')
    sex.value = row.children[7].textContent;

    addRowButton.style.display = 'none'
    editButton.style.display = 'block'

}
editButton.onclick = () => { dataUpdate(); };

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

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
/**
 * JS Ô TÌM KIẾM
 */
searchBtn.onclick = () => {
    //　lay du lieu tu o input
    const searchInputValue = searchInput.value.toLowerCase();
    let studentList = [];
    // tu khoa nhap vao co trung voi id cua khoa hoc khog, neu trung th hien thi.
    studentList = searchClass(data, 'studentId', searchInputValue)

    if (!studentList || studentList.length === 0) {
        // kiem tra ten khoa hoc
        studentList = searchClass(data, 'studentName', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        studentList = searchClass(data, 'year', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        studentList = searchClass(data, 'address', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        studentList = searchClass(data, 'email', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        studentList = searchClass(data, 'phone', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        studentList = searchClass(data, 'sex', searchInputValue)
    }
    if (!studentList || studentList.length === 0) {
        alert(" Không có kết quả nào phù hợp, vui lòng nhập lại")
    } else {
        resetTable(studentList)
    }
}
/**
 * Cập nhật kết quả tìm kiếm vào bảng
 * @param {Object[]} studentList - kết quả tìm kiếm 
 */
// Hàm resetTable được sửa lại để nhận tham số classList
function resetTable(studentList) {
    // Lấy tất cả các dòng hiện tại trong bảng và xóa chúng
    const currentStudentList = document.getElementById('dataTable').querySelectorAll('tbody tr');
    currentStudentList.forEach(currentStudent => currentStudent.remove());

    // Thêm dữ liệu mới vào bảng
    studentList.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.studentId}</td>
            <td>${student.studentName}</td>
            <td>${student.year}</td>
            <td>${student.address}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.studentName}</td>
            <td>
                <button class="edit">Sửa</button> 
            </td>
            <td>
                <button class="delete">Xóa</button>
            </td>
        `;

        // Thêm dòng vào bảng
        document.getElementById('dataTable').querySelector('tbody').appendChild(row);

        // Lắng nghe sự kiện "Sửa" và "Xóa" cho mỗi dòng
        row.querySelector('.edit').addEventListener('click', () => editRow(row));
        row.querySelector('.delete').addEventListener('click', () => deleteRow(STUDENT_DATA_KEY, 'studentId', student.studentId));
    });
}

function searchClass(data, key, condition) {
    // !condition thi tra ve data ..
    if (condition) {
        const lowerCaseCondition = condition.toLowerCase(); // Chuyển điều kiện tìm kiếm thành chữ thường
        return data.filter(item => item[key]?.toString().toLowerCase().includes(lowerCaseCondition)); // Chuyển item[key] thành chữ thường và so sánh
        // return data.filter(item => item[key]?.includes(condition));
    } return data
}

// Hàm sắp xếp dữ liệu theo tên lớp học
function sortClassesByName(student, order) {
    const sortedClasses = [...student]; // Sao chép mảng để không làm thay đổi mảng gốc

    sortedStudent.sort((a, b) => {
        const nameA = a.className.toLowerCase();
        const nameB = b.className.toLowerCase();

        // Sắp xếp theo thứ tự tăng dần ('asc') hoặc giảm dần ('desc')
        return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return sortedStudent;
}

// Lắng nghe sự kiện thay đổi của dropdown sắp xếp
document.getElementById('sortSelect').addEventListener('change', (event) => {
    const sortOrder = event.target.value; // Lấy giá trị từ dropdown (asc hoặc desc)

    // Sắp xếp các lớp học theo tên
    const sortedClasses = sortClassesByName(data, sortOrder);

    // Cập nhật bảng với dữ liệu đã sắp xếp
    resetTable(sortedClasses); // Gọi hàm resetTable đã có của bạn
});

// Khi trang tải, hiển thị bảng với dữ liệu gốc từ localStorage
window.onload = function () {
    resetTable(data);  // Hiển thị bảng khi trang tải
};
