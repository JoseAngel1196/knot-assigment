service_name = knot_backend

.PHONY: lint
lint:
	poetry run pre-commit run --all-files

.PHONY: server-reload
server-reload:
	poetry run uvicorn --reload ${service_name}.app:app --host 0.0.0.0 --port 8000

.PHONY: create-db-users
create-db-users:
	psql postgres -tc "SELECT 1 FROM pg_roles where rolname = 'knot'" | grep -q 1 || psql postgres -c "CREATE ROLE knot WITH SUPERUSER LOGIN CREATEDB CREATEROLE"

.PHONY: create-db
create-db:
	psql postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${service_name}'" | grep -q 1 || psql postgres -c "CREATE DATABASE ${service_name} OWNER knot"

.PHONY: db
db: create-db-users create-db upgrade-db

.PHONY: alembic-migration
alembic-migration:
	@echo "Migration Description: "; \
    read MIGRATION_DESC; \
	PYTHONPATH=. poetry run alembic revision --autogenerate -m "$$MIGRATION_DESC"

.PHONY: upgrade-db
upgrade-db:
	poetry run alembic upgrade head
