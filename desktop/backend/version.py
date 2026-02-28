"""
version.py – Single source of truth for PentaSec app versioning.

APP_VERSION      : the version of this build.
REQUIRED_VERSION : the minimum version that is allowed to run.
                   Set the REQUIRED_VERSION env var on Render (or in .env)
                   to gate old clients without touching code.

If APP_VERSION < REQUIRED_VERSION the frontend will block access and show
an "update required" screen.
"""

import os

APP_VERSION = "1.1.0"

# Controlled via env var — change it on Render to gate older clients instantly.
REQUIRED_VERSION = os.getenv("REQUIRED_VERSION", "1.1.0")


def _parse(version_str: str) -> tuple:
    """Convert a semver string into a comparable tuple of ints."""
    try:
        return tuple(int(x) for x in version_str.strip().split("."))
    except ValueError:
        return (0, 0, 0)


def is_version_satisfied() -> bool:
    """Return True if APP_VERSION >= REQUIRED_VERSION."""
    return _parse(APP_VERSION) >= _parse(REQUIRED_VERSION)

