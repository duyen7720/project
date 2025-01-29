const COURSE_DATA_KEY = 'arrayCourses'
// Load dữ liệu từ Local Storage
const data = JSON.parse(localStorage.getItem(COURSE_DATA_KEY)) || [];
const userInfo = JSON.parse(localStorage.getItem('userInfo'));


// Kiểm tra trạng thái đăng nhập khi trang main được tải
window.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (userInfo) {
    // Nếu người dùng đã đăng nhập, hiển thị nội dung trang chính
    const bodyHTML = document.getElementById('bodyHTML');
    bodyHTML.style.display = 'block';  // Hiển thị nội dung trang

  } else {
    location.href = "./login.html";
  }
});
// Tạo modal xác nhận đăng xuất xuất trong JavaScript
const confirmDialogHTML = `
  <div class="modal-exit" id="confirmDialog">
    <div class="modal-exit__overlay">
      <div class="modal-exit__body">
        <div class="modal-exit__inner">
          <h4 class="modal__logout">Bạn chắc chắn muốn đăng xuất không?</h4>
          <div class="logout--btn">
            <button id="confirmYes">Đăng xuất</button>
            <button id="confirmNo">Huỷ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

document.body.insertAdjacentHTML('beforeend', confirmDialogHTML);
// Lấy các phần tử cần thao tác
const logoutBtn = document.querySelector(".header--logout");  // Nút đăng xuất trên màn hình
const confirmDialog = document.getElementById("confirmDialog"); // Modal
const confirmYes = document.getElementById("confirmYes"); // Nút Đăng xuất
const confirmNo = document.getElementById("confirmNo"); // Nút Huỷ
// Ẩn modal ban đầu
confirmDialog.style.display = 'none';

// Khi nhấn nút đăng xuất, hiển thị modal xác nhận
logoutBtn.addEventListener('click', () => {
  confirmDialog.style.display = 'flex'; // Hiển thị modal
});

// Khi nhấn "Đăng xuất" (Yes), thực hiện hành động đăng xuất
confirmYes.addEventListener('click', () => {
  location.href = "./login.html"
  confirmDialog.style.display = 'none';
  localStorage.removeItem('userInfo');
});

// Khi nhấn "Huỷ" (No), đóng modal
confirmNo.addEventListener('click', () => {
  confirmDialog.style.display = 'none'; // Ẩn modal
});
// JS MODAL CÁC NÚT XOÁ
// Modal xác nhận xóa
const confirmDeleteHTML = `
  <div class="modal" id="confirmDelete">
    <div class="modal__overlay">
      <div class="modal__body">
        <div class="modal__inner">
          <div class="modal__inner--delete">
            <h3>bạn chắc chắn muốn xoá dữ liệu không?</h3>
            <div class="modal__inner--delete-action">
              <button id="delete">Xoá</button>
              <button id="cancel">Huỷ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Thêm HTML của modal vào cuối body
document.body.insertAdjacentHTML('beforeend', confirmDeleteHTML);

// Lấy các phần tử cần thao tác
const confirmDelete = document.getElementById("confirmDelete"); // Modal
const deleteAction = document.getElementById("delete"); // Nút "Xóa"
const cancelAction = document.getElementById("cancel"); // Nút "Huỷ"

// Ẩn modal ban đầu
confirmDelete.style.display = 'none';
