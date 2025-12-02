import argparse
import logging
import sys
import yaml

from .publisher import run_pipeline

def main():
    parser = argparse.ArgumentParser(description="Brikx – Funda → WordPress")
    parser.add_argument("--config", required=True, help="Pad naar config.yaml")
    parser.add_argument("--log-level", default="INFO", help="DEBUG/INFO/WARNING/ERROR")
    args = parser.parse_args()

    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(levelname)s %(name)s: %(message)s"
    )

    log = logging.getLogger("brikx.cli")
    log.info("Brikx gestart")

    with open(args.config, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    try:
        run_pipeline(cfg)
    except Exception as e:
        log.exception("Fout tijdens run: %s", e)
        sys.exit(1)
