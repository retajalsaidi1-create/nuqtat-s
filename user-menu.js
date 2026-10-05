(function () {

    // ================================
    // Supabase
    // ================================

    const SUPABASE_URL = "https://nqtuiuglxabkyjlkmnhl.supabase.co";
    const SUPABASE_KEY = "sb_publishable_ZHAJVrsRkWrgtGdqr7vrzA_c1LnyEPV";


    // ================================
    // تشغيل القائمة
    // ================================

    function startUserMenu() {

        if (!window.supabase || !window.supabase.createClient) {
            console.error("Supabase لم يتم تحميله.");
            return;
        }

        const client = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

        window.nuqtasSupabase = client;


        // ================================
        // إنشاء دائرة المستخدم
        // ================================

        let userMenu = document.querySelector(".user-menu");


        // إذا الصفحة لا تحتوي على دائرة المستخدم
        // يتم إنشاؤها تلقائيًا
        if (!userMenu) {

            userMenu = document.createElement("div");

            userMenu.className = "user-menu";

            userMenu.innerHTML = `

                <button
                    class="user-button"
                    onclick="nuqtasToggleUserMenu()"
                    aria-label="حساب الطالب"
                >
                    👤
                </button>

                <div class="user-dropdown">

                    <div class="user-avatar">
                        👤
                    </div>

                    <strong>الطالب</strong>

                    <span>
                        جاري التحميل...
                    </span>

                    <hr>

                    <button onclick="nuqtasLogout()">
                        🚪 تسجيل الخروج
                    </button>

                </div>
            `;

            document.body.appendChild(userMenu);
        }


        // ================================
        // تحميل بيانات الطالب
        // ================================

        loadUser(client, userMenu);


        // ================================
        // إغلاق القائمة عند الضغط خارجها
        // ================================

        document.addEventListener("click", function (event) {

            if (!userMenu.contains(event.target)) {

                const dropdown =
                    userMenu.querySelector(".user-dropdown");

                if (dropdown) {
                    dropdown.classList.remove("show");
                }

            }

        });

    }


    // ================================
    // تحميل بيانات المستخدم
    // ================================

    async function loadUser(client, userMenu) {

        try {

            const {
                data: {
                    user
                },
                error
            } = await client.auth.getUser();


            // ================================
            // إذا لم يكن هناك تسجيل دخول
            // ================================

            if (error || !user) {

                window.location.href = "index.html";

                return;
            }


            // ================================
            // عناصر قائمة المستخدم
            // ================================

            const avatar =
                userMenu.querySelector(".user-avatar");

            const name =
                userMenu.querySelector("strong");

            const email =
                userMenu.querySelector("span");


            // عرض البريد الإلكتروني
            if (email) {

                email.textContent =
                    user.email || "";

            }


            // ================================
            // جلب بيانات الطالب من profiles
            // ================================

            const {
                data: profile,
                error: profileError
            } = await client
                .from("profiles")
                .select("full_name, grade")
                .eq("id", user.id)
                .maybeSingle();


            // ================================
            // عرض اسم الطالب
            // ================================

            if (!profileError && profile) {

                if (
                    profile.full_name &&
                    profile.full_name.trim() !== ""
                ) {

                    if (name) {

                        name.textContent =
                            profile.full_name;

                    }


                    // أول حرف من الاسم
                    if (avatar) {

                        avatar.textContent =
                            profile.full_name
                                .trim()
                                .charAt(0)
                                .toUpperCase();

                    }

                }

            }


        } catch (error) {

            console.error(
                "حدث خطأ أثناء تحميل بيانات المستخدم:",
                error
            );

        }

    }


    // ================================
    // فتح وإغلاق قائمة المستخدم
    // ================================

    window.nuqtasToggleUserMenu = function () {

        const userMenu =
            document.querySelector(".user-menu");


        if (!userMenu) {
            return;
        }


        const dropdown =
            userMenu.querySelector(".user-dropdown");


        if (!dropdown) {
            return;
        }


        dropdown.classList.toggle("show");

    };


    // ================================
    // تسجيل الخروج
    // ================================

    window.nuqtasLogout = async function () {

        try {

            const client =
                window.nuqtasSupabase;


            if (client) {

                await client.auth.signOut();

            }


            window.location.href =
                "index.html";


        } catch (error) {

            console.error(
                "حدث خطأ أثناء تسجيل الخروج:",
                error
            );


            // في حالة حدوث خطأ
            // نرجع لصفحة تسجيل الدخول

            window.location.href =
                "index.html";

        }

    };


    // ================================
    // تحميل Supabase تلقائيًا
    // ================================

    function loadSupabase() {

        // إذا Supabase موجود أصلًا
        if (
            window.supabase &&
            window.supabase.createClient
        ) {

            startUserMenu();

            return;
        }


        // إنشاء رابط تحميل Supabase
        const script =
            document.createElement("script");

        script.src =
            "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";


        script.onload = function () {

            startUserMenu();

        };


        script.onerror = function () {

            console.error(
                "تعذر تحميل Supabase."
            );

        };


        document.head.appendChild(script);

    }


    // ================================
    // بدء التشغيل
    // ================================

    loadSupabase();


})();
