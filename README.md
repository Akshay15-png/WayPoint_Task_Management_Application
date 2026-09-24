# Running project locally
Packages & Services Required:
```bash
npm
uv
postgresql
python3
```



Run these services to start the application




### For frontend
```bash
npm run dev -- --host 0.0.0.0
```
### For db & FastAPI
```bash
sudo systemctl start postgresql.service
uv run fastapi dev ./backend/main.py
```
