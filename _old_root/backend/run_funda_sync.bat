@echo off
cd /d "E:\Funda Wordpress"
.\.venv\Scripts\activate
python -m brikx --config .\config.yaml --log-level INFO