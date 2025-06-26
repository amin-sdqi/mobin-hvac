#!/bin/bash

set -e  # اگر هر خطایی پیش بیاد، اسکریپت متوقف می‌شه

echo "شروع دیپلوی..."

# مرحله 1: اطمینان از اینکه تغییرات شاخه main پوش شده
git add -A
git commit -m "Update before deploy" || echo "هیچ تغییر جدیدی برای کامیت نیست"

git push origin main

# مرحله 2: پوش پوشه dist روی شاخه gh-pages با subtree
git subtree push --prefix dist origin gh-pages

echo "دیپلوی با موفقیت انجام شد."
