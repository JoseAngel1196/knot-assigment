FROM python:3.13.4-bullseye

# This is set to non-interactive so when any packages are installed via apt-get, they will not wait for user input.
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /knot-setup

# Misc tooling
RUN apt-get update \
    && apt-get -y upgrade \
    && apt-get -y install --no-install-recommends \
        netcat \
        wget \
        openssh-client \
        libcurl4-openssl-dev \
        git \
        libssl-dev \
        curl \
        mtr \
        gnupg \
        software-properties-common \
        unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install default Poetry with central installer
RUN curl -sSL https://install.python-poetry.org | POETRY_VERSION=1.8.5 python3 -
ENV PATH="$PATH:/root/.local/bin"

WORKDIR /knot-backend

# Copy necessary files
COPY pyproject.toml .
COPY poetry.lock .
COPY alembic.ini .
COPY alembic/ alembic/
COPY knot_backend/ knot_backend/

# Install requirements
RUN poetry install --only main

# `--workers 2` explicitly sets the number of workers based on the recommendation found
# in the official FastAPI Docker image: https://github.com/tiangolo/uvicorn-gunicorn-starlette-docker/blob/master/README.md#workers_per_core
ENV WORKERS=2

# `--loop uvloop` explicitly uses the uvloop implementation as the event loop, according
# to the FastAPI docs uvloop provides better performance over asyncio: https://fastapi.tiangolo.com/alternatives/#uvicorn
ENV LOOP=uvloop

# Expose port and run service command
EXPOSE 8080
CMD ["sh", "-c", "poetry run uvicorn knot_backend.app:app --host 0.0.0.0 --port 8080 --timeout-keep-alive 625 --workers $WORKERS --loop $LOOP --header server:TI-84 --no-access-log"]
