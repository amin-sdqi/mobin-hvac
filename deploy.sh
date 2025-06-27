#!/bin/bash

# -------------------------------
# تنظیمات
# آدرس ریموت (GitHub repo) — فقط اگر لازم باشه
REMOTE_NAME="origin"
BRANCH_NAME="main"

# پیام کامیت از آرگومان اول بگیر، اگر نبود پیام پیشفرض بزار
COMMIT_MSG=${1:-"Update code"}

# -------------------------------

# بررسی وجود تغییرات
if [[ -n $(git status --porcelain) ]]; then
    echo "تغییرات یافت شد. آماده انجام عملیات گیت..."

    # اضافه کردن همه تغییرات
    git add .

    # کامیت با پیام
    git commit -m "$COMMIT_MSG"

    # پوش به ریموت اصلی
    git push $REMOTE_NAME $BRANCH_NAME

    if [ $? -eq 0 ]; then
        echo "پوش موفق بود ✅"
    else
        echo "خطا در هنگام پوش ❌"
    fi

else
    echo "تغییری برای کامیت یافت نشد. هیچ کاری انجام نشد."
fi
