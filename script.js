// ตัวแปรสำหรับเก็บ reference ของรูปที่กำลังแก้ไข
let currentEditingImage = null;

// เพิ่มเอฟเฟคการเคลื่อนไหวเมื่อ scroll
window.addEventListener('scroll', () => {
    const timeSlots = document.querySelectorAll('.time-slot');
    const scrollPosition = window.scrollY + window.innerHeight;
    
    timeSlots.forEach(slot => {
        if (scrollPosition > slot.offsetTop + 100) {
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        }
    });
});

// เริ่มต้นด้วยการซ่อน time-slots
document.addEventListener('DOMContentLoaded', () => {
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach((slot, index) => {
        slot.style.opacity = '0';
        slot.style.transform = 'translateY(50px)';
        slot.style.transition = 'all 0.6s ease';
        
        // แสดงทีละใบหลังจาก load
        setTimeout(() => {
            slot.style.opacity = '1';
            slot.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// ฟังก์ชันสำหรับแก้ไขข้อมูล
function makeEditable() {
    const editableElements = document.querySelectorAll('.location-name, .details p, .time-badge, .budget-item p');
    
    editableElements.forEach(element => {
        element.contentEditable = true;
        element.style.border = '2px dashed #667eea';
        element.style.padding = '5px';
        element.style.borderRadius = '5px';
        element.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        
        element.addEventListener('blur', function() {
            this.style.border = 'none';
            this.style.backgroundColor = 'transparent';
            this.style.padding = '0';
        });
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.blur();
            }
        });
    });
    
    // เปลี่ยนปุ่มเป็น "บันทึก"
    const editBtn = document.querySelector('.edit-btn');
    editBtn.textContent = '💾 บันทึกการแก้ไข';
    editBtn.onclick = saveChanges;
}

function saveChanges() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.contentEditable = false;
        element.style.border = 'none';
        element.style.backgroundColor = 'transparent';
        element.style.padding = '0';
    });
    
    // เปลี่ยนปุ่มกลับเป็น "แก้ไข"
    const editBtn = document.querySelector('.edit-btn');
    editBtn.textContent = '✏️ แก้ไขแผนการเที่ยว';
    editBtn.onclick = makeEditable;
    
    // แสดงข้อความยืนยัน
    showNotification('บันทึกการแก้ไขเรียบร้อย!');
}

// ฟังก์ชันแสดงการแจ้งเตือน
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const colors = {
        success: 'linear-gradient(45deg, #00b894, #00cec9)',
        error: 'linear-gradient(45deg, #d63031, #e17055)',
        info: 'linear-gradient(45deg, #667eea, #764ba2)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        font-weight: bold;
        transform: translateX(300px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ฟังก์ชันเพิ่มสถานที่ใหม่
function addNewLocation() {
    const timeline = document.querySelector('.timeline');
    const newSlot = document.createElement('div');
    newSlot.className = 'time-slot';
    newSlot.innerHTML = `
        <div class="time-header">
            <div class="time-badge">XX:XX - XX:XX</div>
            <div class="location-name">สถานที่ใหม่</div>
        </div>
        <div class="content-grid">
            <div class="details">
                <h3>🎯 กิจกรรมใหม่</h3>
                <p>คลิกเพื่อแก้ไขรายละเอียด...</p>
                <p><strong>การเดินทาง:</strong> เพิ่มข้อมูลการเดินทาง</p>
                <div class="tips">
                    <h4>💡 เคล็ดลับ</h4>
                    <p>เพิ่มเคล็ดลับที่เป็นประโยชน์</p>
                </div>
            </div>
            <div class="image-container">
                <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=300&h=200&fit=crop" alt="สถานที่ใหม่" class="location-image">
                <div class="image-edit-overlay" onclick="openImageModal(this)">
                    <div class="image-edit-text">🖼️<br>คลิกเพื่อเปลี่ยนรูป</div>
                </div>
            </div>
        </div>
    `;
    
    timeline.insertBefore(newSlot, timeline.lastElementChild);
    newSlot.scrollIntoView({ behavior: 'smooth' });
    showNotification('เพิ่มสถานที่ใหม่แล้ว!');
}

// ฟังก์ชันเปิด Modal แก้ไขรูปภาพ
function openImageModal(overlay) {
    const img = overlay.previousElementSibling;
    currentEditingImage = img;
    document.getElementById('imageUrlInput').value = img.src;
    document.getElementById('imageModal').style.display = 'flex';
}

// ฟังก์ชันปิด Modal
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
    currentEditingImage = null;
}

// ฟังก์ชันบันทึก URL รูปภาพ
function saveImageUrl() {
    const newUrl = document.getElementById('imageUrlInput').value.trim();
    if (newUrl && currentEditingImage) {
        // ตรวจสอบว่า URL ถูกต้องหรือไม่
        const img = new Image();
        img.onload = function() {
            currentEditingImage.src = newUrl;
            closeImageModal();
            showNotification('เปลี่ยนรูปภาพเรียบร้อย!');
        };
        img.onerror = function() {
            showNotification('URL รูปภาพไม่ถูกต้อง กรุณาลองใหม่', 'error');
        };
        img.src = newUrl;
    } else {
        showNotification('กรุณาใส่ URL รูปภาพ', 'error');
    }
}

// ฟังก์ชัน scroll กลับไปด้านบน
function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // ปิด Modal เมื่อคลิกนอกพื้นที่
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeImageModal();
            }
        });
    }
    
    // เพิ่ม event listener สำหรับปุ่ม floating
    const floatingIcon = document.querySelector('.floating-icon');
    if (floatingIcon) {
        floatingIcon.addEventListener('click', scrollToTop);
    }
});
