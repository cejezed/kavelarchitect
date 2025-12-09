from brikx.map_fetcher import download_static_map
p = download_static_map(51.9370171, 4.7619604, size="800x500", zoom=15, out_path="artifacts/maps/geoapify_test.png")
print("OK:", p)