// تفعيل القائمة المتحركة على الهواتف
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    if(burger) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // إغلاق القائمة عند النقر على رابط
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // تحميل الشعار من الرابط المقدم
    const logoImg = document.getElementById('club-logo');
    if(logoImg && !logoImg.src.includes('assets/images/logo.png')) {
        logoImg.src = 'https://i.ibb.co/JR8x-NXSw/1.png';
        logoImg.onerror = function() {
            // إذا فشل تحميل الشعار، استخدم شعار افتراضي
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjgyRTMwIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0Y0NjUzMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFGPC90ZXh0Pgo8L3N2Zz4K';
        };
    }
    
    // تأثير التمرير للبطاقات
    const cards = document.querySelectorAll('.vision-card, .dept-card, .admin-card, .value-card');
    
    function checkScroll() {
        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if(cardTop < windowHeight - 100) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // تهيئة البطاقات
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // تفعيل عند التحميل
    
    // تفعيل النماذج التفاعلية
    const decisionForm = document.getElementById('decisionForm');
    if(decisionForm) {
        decisionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = new FormData(decisionForm);
            const decisionData = Object.fromEntries(formData);
            
            // عرض رسالة النجاح
            const successMessage = document.getElementById('formSuccess');
            if(successMessage) {
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // إعادة تعيين النموذج
                decisionForm.reset();
                
                // إخفاء الرسالة بعد 5 ثواني
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
            
            // هنا يمكنك إضافة كود إرسال البيانات إلى الخادم
            console.log('بيانات القرار:', decisionData);
        });
    }
    
    // إضافة التاريخ الحالي تلقائياً في نماذج القرارات
    const dateInput = document.getElementById('decisionDate');
    if(dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
    
    // توليد رقم قرار تلقائي
    const decisionNumberInput = document.getElementById('decisionNumber');
    if(decisionNumberInput) {
        // رقم عشوائي لأغراض العرض
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        decisionNumberInput.value = `قرار-${new Date().getFullYear()}-${randomNum}`;
    }
});

// وظيفة لتحميل بيانات الهيكل التنظيمي
async function loadOrganizationalData() {
    try {
        const response = await fetch('data/departments.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        return null;
    }
}

// وظيفة لتحميل بيانات القيادة
async function loadLeadershipData() {
    try {
        const response = await fetch('data/leadership.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات القيادة:', error);
        return null;
    }
}