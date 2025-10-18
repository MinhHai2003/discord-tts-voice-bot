# 🚂 RAILWAY DEPLOYMENT - STEP BY STEP

## ✅ Code đã sẵn sàng để deploy!

Bot của bạn đã hoạt động perfect với voice! Bây giờ chỉ cần deploy lên Railway:

## 🚀 BƯỚC 1: Đăng ký Railway

1. **Vào:** https://railway.app
2. **Click:** "Start a New Project" 
3. **Login:** "Login with GitHub"
4. **Authorize:** Cho phép Railway truy cập GitHub repos

## 🚀 BƯỚC 2: Deploy từ GitHub

1. **Dashboard:** Click "New Project"
2. **Deploy from GitHub repo:** 
   - Select repo: `MinhHai2003/discord-tts-voice-bot`
   - Branch: `main`
3. **Railway sẽ tự động:**
   - Detect Node.js project
   - Install dependencies
   - Build project

## 🚀 BƯỚC 3: Thêm Environment Variable

1. **Project Dashboard:** Click vào project vừa tạo
2. **Variables tab:** 
   - Click "New Variable"
   - **Name:** `DISCORD_TOKEN`
   - **Value:** `YOUR_DISCORD_BOT_TOKEN_HERE`
   - Click "Add"

3. **Railway sẽ tự động redeploy** với token mới

## 🚀 BƯỚC 4: Kiểm tra Deployment

1. **Deployments tab:** 
   - Xem deployment status
   - Check logs có dòng: `✅ Bot đã online với tên: Voice#0174`

2. **Logs tab:**
   - Real-time logs của bot
   - Kiểm tra có lỗi gì không

## ✅ KẾT QUẢ MONG ĐỢI:

```
✅ Bot online 24/7 trên Railway
✅ Voice functionality hoạt động perfect
✅ $5 credit/tháng (đủ dư cho bot nhỏ)
✅ Auto-restart khi có issue
✅ Auto-deploy khi push code mới
```

## 📊 QUẢN LÝ BOT:

**Railway Dashboard:**
- **Logs:** Xem real-time logs
- **Metrics:** CPU/Memory usage  
- **Variables:** Manage environment variables
- **Settings → Restart:** Restart bot

**Update bot:**
```bash
# Push code mới lên GitHub
git add .
git commit -m "Update bot"
git push origin main
# Railway tự động deploy!
```

## 🆘 TROUBLESHOOTING:

**Nếu bot không online:**
1. Check Logs tab → tìm error message
2. Ensure DISCORD_TOKEN được set đúng
3. Variables tab → Verify token value

**Nếu voice không work:**
- Railway hỗ trợ audio processing
- Check logs có lỗi FFmpeg không
- Bot local work thì Railway cũng sẽ work

## 💰 COST ESTIMATE:

```
Railway Credit: $5/month FREE
Bot Usage: ~$2-3/month  
Net Cost: $0 (còn dư $2-3)
```

---

## 🎯 NEXT STEPS:

1. **Vào railway.app** và làm theo 4 bước trên
2. **Deploy bot** (5 phút)
3. **Kiểm tra bot online** trong Discord
4. **Test voice functionality** 
5. **Enjoy 24/7 bot!** 🎉

**Railway URL:** https://railway.app
**GitHub Repo:** https://github.com/MinhHai2003/discord-tts-voice-bot