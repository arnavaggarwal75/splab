ARG PYTHON_VERSION=3.12.3
FROM python:${PYTHON_VERSION}-slim

# Python environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Specify WORKDIR
WORKDIR /app

# Configure non-privileged user
ARG UID=10001
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home "/nonexistent" \
  --shell "/sbin/nologin" \
  --no-create-home \
  --uid "${UID}" \
  appuser

# Download dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
  --mount=type=bind,source=requirements.txt,target=requirements.txt \
  python -m pip install -r requirements.txt

# Switch to unprivileged user and run
USER appuser
COPY app/ .
EXPOSE 8000
CMD ["fastapi", "run", "main.py"]

