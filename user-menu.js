(function () {

    // ================================
    // Supabase
    // ================================

    const SUPABASE_URL = "https://nqtuiuglxabkyjlkmnhl.supabase.co";
    const SUPABASE_KEY = "sb_publishable_ZHAJVrsRkWrgtGdqr7vrzA_c1LnyEPV";


    // ================================
    // تشغيل Supabase
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

        // إذا الصفحة لا تحتوي على القائمة،
        // ننشئها تلقائيًا
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
        // جلب بيانات الطالب
        // ================================

        loadUser(client, userMenu);
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


            // إذا ما فيه مستخدم مسجل دخول
            if (error || !user) {

                window.location.href = "index.html";

                return;
            }


            // عناصر القائمة
            const avatar = userMenu.querySelector(".user-avatar");
            const name = userMenu.querySelector("strong");
            const email = userMenu.querySelector("span");


            // عرض الإيميل
            if (email) {
                email.textContent = user.email || "";
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


            if (!profileError && profile) {

                // الاسم
                if (profile.full_name && profile.full_name.trim() !== "") {

                    if (name) {
                        name.textContent = profile.full_name;
                    }


                    // أول حرف من الاسم
                    if (avatar) {

                        avatar.textContent =
                            profile.full_name.trim().charAt(0).toUpperCase();

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
    // فتح وإغلاق القائمة
    // ================================

    window.nuqtasToggleUserMenu = function () {

        const userMenu = document.querySelector(".user-menu");

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

            const client = window.nuqtasSupabase;

            if (client) {

                await client.auth.signOut();

            }

            window.location.href = "index.html";

        } catch (error) {

            console.error(
                "حدث خطأ أثناء تسجيل الخروج:",
                error
            );

            // حتى لو صار خطأ، نرجع لصفحة الدخول
            window.location.href = "index.html";
        }

    };


    // ================================
    // إغلاق القائمة عند الضغط خارجها
    // ================================

    document.addEventListener("click", function (event) {

        const userMenu =
            document.querySelector(".user-menu");

        if (!userMenu) {
            return;
        }

        if (!userMenu.contains(event.target)) {

            const dropdown =
                userMenu.querySelector(".user-dropdown");

            if (dropdown) {

                dropdown.classList.remove("show");

            }

        }

    });


    // ================================
    // تشغيل
    // ================================

    startUserMenu();


})();
