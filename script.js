    // Header / logo / burger initialisation (may run after layout injection)
    function initHeaderAndLogo() {
        const burger = document.querySelector('.burger');
        const navLinks = document.querySelector('.nav-links');

        if(burger && navLinks) {
            // remove previous listeners by cloning
            const newBurger = burger.cloneNode(true);
            burger.parentNode.replaceChild(newBurger, burger);
            newBurger.addEventListener('click', function() {
                navLinks.classList.toggle('active');
            });
        }

        // إغلاق القائمة عند النقر على رابط
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (navLinks) navLinks.classList.remove('active');
            });
        });

        // تحميل الشعار من الرابط المقدم
        const logoImg = document.getElementById('club-logo');
        if(logoImg) {
            logoImg.src = 'https://i.ibb.co/JR8xNXSw/1.png';
            logoImg.onerror = function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMjgyRTMwIi8+CjxwYXRoIGQ9Ik01MCA1MEgxNTBWMTUwSDUwVjUwWiIgZmlsbD0iI0Y0NjUzMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjEyMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkFGPC90ZXh0Pgo8L3N2Zz4K';
            };
        }
    }

    // Initialize header when layout is ready (injected by load-layout.js)
    window.addEventListener('layout:ready', () => initHeaderAndLogo());
    // also try to initialize immediately (for pages that already contain header)
    try { initHeaderAndLogo(); } catch(e) {}
    
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
    
    // تفعيل نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع بيانات النموذج
            const formData = new FormData(contactForm);
            const contactData = Object.fromEntries(formData);
            
            // عرض رسالة النجاح
            const successMessage = document.getElementById('contactSuccess');
            if(successMessage) {
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // إعادة تعيين النموذج
                contactForm.reset();
                
                // إخفاء الرسالة بعد 5 ثواني
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 5000);
            }
            
            // هنا يمكنك إضافة كود إرسال البيانات إلى الخادم
            console.log('بيانات الاتصال:', contactData);
        });
    }

    // --- إدارة تسجيل الدخول عبر Supabase ---
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // create supabase client (depends on assets/supabase-config.js)
    let supabaseClient = null;
    try {
        if (window.supabase && window.SUPABASE_CONFIG) {
            supabaseClient = window.supabase.createClient(window.SUPABASE_CONFIG.SUPABASE_URL, window.SUPABASE_CONFIG.SUPABASE_ANON_KEY);
        } else {
            console.warn('Supabase client not configured. Ensure assets/supabase-config.js is generated.');
        }
    } catch (e) {
        console.error('Error creating Supabase client', e);
    }

    // احصل على مستند المستخدم من جدول profiles
    async function getUserDoc(uid) {
        try {
            if (!supabaseClient) return null;
            const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', uid).single();
            if (error) {
                if (error.code !== 'PGRST116') console.error('getUserDoc error', error);
                return null;
            }
            // roles stored as JSON string or array
            if (data && data.roles) {
                try {
                    data.roles = typeof data.roles === 'string' ? JSON.parse(data.roles) : data.roles;
                } catch (_) {
                    // keep as-is
                }
            } else {
                data.roles = [];
            }
            return data;
        } catch (e) {
            console.error('getUserDoc error', e);
            return null;
        }
    }

    function attachLogoutHandler() {
        const logoutEl = document.getElementById('logout-btn');
        if (!logoutEl) return;
        // remove existing listeners safely by replacing node
        const newLogout = logoutEl.cloneNode(true);
        logoutEl.parentNode.replaceChild(newLogout, logoutEl);
        newLogout.addEventListener('click', async function (e) {
            e.preventDefault();
            if (supabaseClient && supabaseClient.auth) {
                await supabaseClient.auth.signOut();
                setAuthUIState(null);
                window.location.href = '/index.html';
            } else {
                setAuthUIState(null);
                window.location.href = '/index.html';
            }
        });
    }

    function setAuthUIState(userData) {
        const loginBtnEl = document.getElementById('login-btn');
        const logoutBtnEl = document.getElementById('logout-btn');
        if (loginBtnEl && logoutBtnEl) {
            if (userData) {
                loginBtnEl.style.display = 'none';
                logoutBtnEl.style.display = 'inline-block';
                logoutBtnEl.textContent = 'تسجيل الخروج';
            } else {
                loginBtnEl.style.display = 'inline-block';
                logoutBtnEl.style.display = 'none';
            }
        }
        // ensure logout handler attached to the current button element
        attachLogoutHandler();
    }

    // راقب حالة المصادقة عبر Supabase
    if (supabaseClient && supabaseClient.auth) {
        // auth check and state watcher
        async function runAuthInitialCheck() {
            try {
                const { data: sessionData } = await supabaseClient.auth.getSession();
                const session = sessionData ? sessionData.session : null;
                const user = session && session.user ? session.user : null;
                if (user) {
                    const userDoc = await getUserDoc(user.id);
                    const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
                    const allowed = emailConfirmed && userDoc && userDoc.approved;
                    setAuthUIState(allowed ? userDoc : null);
                } else {
                    setAuthUIState(null);
                }
            } catch (e) {
                console.warn('getSession error', e);
                setAuthUIState(null);
            }
        }

        // run initial check now
        runAuthInitialCheck();

        // auth state changes
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            const user = session && session.user ? session.user : null;
            if (user) {
                const userDoc = await getUserDoc(user.id);
                const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
                const allowed = emailConfirmed && userDoc && userDoc.approved;
                setAuthUIState(allowed ? userDoc : null);
            } else {
                setAuthUIState(null);
            }
        });

        // ensure we re-run the initial check after layout injection in case header/buttons were missing earlier
        window.addEventListener('layout:ready', () => {
            try { runAuthInitialCheck(); } catch (e) { console.warn(e); }
        });
    } else {
        setAuthUIState(null);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            if (supabaseClient && supabaseClient.auth) {
                await supabaseClient.auth.signOut();
                setAuthUIState(null);
                window.location.href = '/index.html';
            } else {
                setAuthUIState(null);
                window.location.href = '/index.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            if (!email || !password) {
                if (loginError) {
                    loginError.textContent = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
                    loginError.style.display = 'block';
                }
                return;
            }

            try {
                if (supabaseClient && supabaseClient.auth) {
                    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                    const user = data.user;
                    const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
                    if (!emailConfirmed) {
                        if (loginError) {
                            loginError.textContent = 'يرجى تأكيد البريد الإلكتروني أولاً (تحقق من صندوق الرسائل).';
                            loginError.style.display = 'block';
                        }
                        await supabaseClient.auth.signOut();
                        return;
                    }
                    const userDoc = await getUserDoc(user.id);
                    if (!userDoc || !userDoc.approved) {
                        if (loginError) {
                            loginError.textContent = 'حسابك قيد المراجعة. يرجى الانتظار حتى يعتمد المشرف عضويتك.';
                            loginError.style.display = 'block';
                        }
                        await supabaseClient.auth.signOut();
                        return;
                    }
                    // ناجح
                    window.location.href = '../index.html';
                }
            } catch (err) {
                if (loginError) {
                    loginError.textContent = (err && err.message) || 'خطأ أثناء تسجيل الدخول.';
                    loginError.style.display = 'block';
                }
                console.error(err);
            }
        });
    }

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

// وظيفة للتأكد من الوصول إلى محتوى محمي بعنصر DOM
function checkDecisionAccess() {
    const protectedEl = document.getElementById('protected-decision');
    const messageEl = document.getElementById('protected-message');
    if(!protectedEl) return;
    // استخدم Supabase للتحقق
    const supabase = (window.supabase && window.SUPABASE_CONFIG) ? window.supabase.createClient(window.SUPABASE_CONFIG.SUPABASE_URL, window.SUPABASE_CONFIG.SUPABASE_ANON_KEY) : null;
    if(!supabase) {
        protectedEl.style.display = 'none';
        if(messageEl) {
            messageEl.innerHTML = '<p style="color:#e74c3c;">يتطلب هذا القسم تسجيل الدخول. ادخل عبر صفحة التسجيل أو اتصل بالمسؤول.</p>';
            messageEl.style.display = '';
        }
        return;
    }

    (async () => {
        const { data } = await supabase.auth.getUser();
        const user = data && data.user ? data.user : null;
        if(!user) {
            protectedEl.style.display = 'none';
            if(messageEl) {
                messageEl.innerHTML = '<p style="color:#e74c3c;">يجب تسجيل الدخول لعرض هذا المحتوى.</p>' +
                                      '<p><a href="../pages/login.html" class="btn-secondary">تسجيل الدخول</a> أو <a href="../pages/register.html" class="btn-secondary">إنشاء حساب</a></p>';
                messageEl.style.display = '';
            }
            return;
        }

        try {
            const { data: profile } = await supabase.from('profiles').select('approved, roles').eq('id', user.id).single();
            const roles = profile && profile.roles ? (Array.isArray(profile.roles) ? profile.roles : (typeof profile.roles === 'string' ? JSON.parse(profile.roles) : [profile.roles])) : [];
            const emailConfirmed = !!(user.email_confirmed_at || user.confirmed_at);
            if(emailConfirmed && profile && profile.approved && roles.includes(protectedEl.dataset.role)) {
                protectedEl.style.display = '';
                if(messageEl) messageEl.style.display = 'none';
                return;
            }

            protectedEl.style.display = 'none';
            if(messageEl) {
                if(!emailConfirmed) {
                    messageEl.innerHTML = '<p style="color:#e67e22;">يرجى تأكيد بريدك الإلكتروني أولاً.</p>' +
                                          '<p><a href="../pages/login.html" class="btn-secondary">الذهاب لتسجيل الدخول</a></p>';
                } else if(!profile || !profile.approved) {
                    messageEl.innerHTML = '<p style="color:#e74c3c;">حسابك قيد المراجعة وسيحتاج إلى موافقة المشرف لعرض هذه الصفحة.</p>' +
                                          '<p><a href="../pages/contact.html" class="btn-secondary">مراسلة الإدارة</a></p>';
                } else {
                    messageEl.innerHTML = '<p style="color:#e74c3c;">عذراً، لا تملك الصلاحية المطلوبة لعرض هذا المحتوى.</p>';
                }
                messageEl.style.display = '';
            }
        } catch (e) {
            console.error('checkDecisionAccess error', e);
            protectedEl.style.display = 'none';
            if(messageEl) {
                messageEl.innerHTML = '<p>حدث خطأ أثناء التحقق من صلاحياتك.</p>';
                messageEl.style.display = '';
            }
        }
    })();
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
